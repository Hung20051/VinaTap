const db = require("../config/db");

// Regex phát hiện thiết bị Mobile / Tablet
const MOBILE_REGEX =
  /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i;
const TABLET_REGEX = /iPad|Tablet|PlayBook/i;

// Regex phát hiện Bot / Crawler tự động ngầm
const BOT_REGEX =
  /bot|crawl|spider|slurp|facebookexternalhit|python-requests|curl|wget|selenium|puppeteer/i;

const PageView = {
  // Ghi nhận lượt xem trang thực tế
  async track({
    pagePath,
    provinceSlug,
    ipAddress,
    userAgent,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
    sessionId,
    durationSeconds = 0,
  }) {
    const ua = userAgent || "";
    const isBot = BOT_REGEX.test(ua) ? 1 : 0;
    let deviceType = "desktop";
    if (TABLET_REGEX.test(ua)) deviceType = "tablet";
    else if (MOBILE_REGEX.test(ua)) deviceType = "mobile";

    // Trích xuất province_slug nếu path dạng /province/:slug hoặc /provinces/:slug
    let slug = provinceSlug;
    if (!slug && pagePath) {
      if (pagePath.startsWith("/province/")) {
        slug = pagePath
          .replace("/province/", "")
          .split("?")[0]
          .split("#")[0]
          .replace(/\/$/, "");
      } else if (pagePath.startsWith("/provinces/")) {
        slug = pagePath
          .replace("/provinces/", "")
          .split("?")[0]
          .split("#")[0]
          .replace(/\/$/, "");
      }
    }

    const cleanPath = (pagePath || "").slice(0, 255);
    const cleanRef = (referrer || "").slice(0, 500);
    const cleanSource = (utmSource || "").slice(0, 100);
    const cleanMedium = (utmMedium || "").slice(0, 100);
    const cleanCampaign = (utmCampaign || "").slice(0, 100);
    const cleanSession = (sessionId || "").slice(0, 64);
    const duration = Math.max(0, parseInt(durationSeconds, 10) || 0);

    // Nếu đã có session trên cùng page_path trong vòng 1 giờ, cập nhật duration_seconds thay vì tạo dòng mới
    if (cleanSession && duration > 0) {
      const [existing] = await db.execute(
        `SELECT id, duration_seconds FROM page_views 
         WHERE session_id = ? AND page_path = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
         ORDER BY id DESC LIMIT 1`,
        [cleanSession, cleanPath]
      );
      if (existing.length > 0) {
        const rowId = existing[0].id;
        await db.execute(
          `UPDATE page_views SET duration_seconds = GREATEST(duration_seconds, ?) WHERE id = ?`,
          [duration, rowId]
        );

        // Đồng bộ thời lượng truy cập vào thẻ NFC nếu là trang thẻ /t/[token]
        if (cleanPath.startsWith("/t/")) {
          const token = cleanPath.replace(/^\/t\//, "").split("?")[0].split("#")[0].trim();
          if (token) {
            db.execute(
              `UPDATE nfc_cards 
               SET last_duration_seconds = GREATEST(COALESCE(last_duration_seconds, 0), ?) 
               WHERE nfc_token = ?`,
              [duration, token]
            ).catch(() => {});
          }
        }

        return { success: true, updated: true, insertId: rowId, deviceType, slug };
      }
    }

    const [result] = await db.execute(
      `INSERT INTO page_views 
       (page_path, province_slug, ip_address, user_agent, device_type, is_bot, referrer, utm_source, utm_medium, utm_campaign, session_id, duration_seconds)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanPath,
        slug || null,
        ipAddress || null,
        ua,
        deviceType,
        isBot,
        cleanRef || null,
        cleanSource || null,
        cleanMedium || null,
        cleanCampaign || null,
        cleanSession || null,
        duration,
      ],
    );

    // Nếu trang bắt đầu bằng /t/[token], cập nhật thông tin truy cập của thẻ
    if (cleanPath.startsWith("/t/")) {
      const token = cleanPath.replace(/^\/t\//, "").split("?")[0].split("#")[0].trim();
      if (token) {
        db.execute(
          `UPDATE nfc_cards 
           SET tap_count = tap_count + 1,
               last_tapped_at = NOW(),
               last_duration_seconds = GREATEST(COALESCE(last_duration_seconds, 0), ?) 
           WHERE nfc_token = ?`,
          [duration, token]
        ).catch(() => {});
      }
    }

    return { success: true, insertId: result?.insertId, deviceType, slug };
  },

  // Lấy thống kê chi tiết lượt truy cập
  async getAnalyticsStats(timeframe = "7days") {
    let whereClause = "WHERE pv.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    let daysCount = 7;
    let isToday = false;

    if (timeframe === "today") {
      whereClause = "WHERE DATE(pv.created_at) = CURDATE()";
      daysCount = 1;
      isToday = true;
    } else if (timeframe === "30days") {
      whereClause = "WHERE pv.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
      daysCount = 30;
    } else if (timeframe === "all") {
      whereClause = "";
      daysCount = 90;
    }

    let totalViewsCount = 0;
    let uniqueVisitorsCount = 0;
    let todayViewsCount = 0;
    let botBlockedCount = 0;
    let nfcScansCount = 0;
    let avgDuration = 0;
    let timelineStats = [];
    let deviceStatsRows = [];
    let channelStatsRows = [];
    let topPagesRows = [];
    let topProvincesRows = [];
    let topReferrersRows = [];
    let utmCampaignsRows = [];
    let recentViewsRows = [];

    // 1. Tổng lượt xem
    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count, AVG(NULLIF(pv.duration_seconds, 0)) AS avg_dur
         FROM page_views pv ${whereClause}`,
      );
      totalViewsCount = res[0]?.count || 0;
      avgDuration = Math.round(res[0]?.avg_dur || 0);
    } catch (e) {
      console.error("PageView q1 error:", e.message);
    }

    // 2. Khách xem độc nhất
    try {
      const [res] = await db.execute(
        `SELECT COUNT(DISTINCT pv.ip_address) AS count FROM page_views pv ${whereClause}`,
      );
      uniqueVisitorsCount = res[0]?.count || 0;
    } catch (e) {
      console.error("PageView q2 error:", e.message);
    }

    // 3. Lượt xem hôm nay
    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM page_views pv WHERE DATE(pv.created_at) = CURDATE()`,
      );
      todayViewsCount = res[0]?.count || 0;
    } catch (e) {
      console.error("PageView q3 error:", e.message);
    }

    // 4. Bot đã chặn
    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM page_views pv WHERE pv.is_bot = 1`,
      );
      botBlockedCount = res[0]?.count || 0;
    } catch (e) {
      console.error("PageView q4 error:", e.message);
    }

    // 5. Số lượt quét thẻ NFC (/t/[token] hoặc utm_source='nfc')
    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM page_views pv 
         ${whereClause ? `${whereClause} AND` : "WHERE"} 
         (pv.page_path LIKE '/t/%' OR pv.utm_source = 'nfc')`,
      );
      nfcScansCount = res[0]?.count || 0;
    } catch (e) {
      console.error("PageView q5 error:", e.message);
    }

    // 6. Timeline lượt xem (theo giờ nếu hôm nay, theo ngày nếu nhiều ngày)
    try {
      if (isToday) {
        const [res] = await db.execute(
          `SELECT DATE_FORMAT(pv.created_at, '%H:00') AS time_label, COUNT(*) AS views, COUNT(DISTINCT pv.ip_address) AS visitors
           FROM page_views pv
           WHERE DATE(pv.created_at) = CURDATE()
           GROUP BY DATE_FORMAT(pv.created_at, '%H:00')
           ORDER BY time_label ASC`,
        );
        timelineStats = res || [];
      } else {
        const [res] = await db.execute(
          `SELECT DATE_FORMAT(pv.created_at, '%d/%m') AS time_label, COUNT(*) AS views, COUNT(DISTINCT pv.ip_address) AS visitors
           FROM page_views pv
           ${whereClause}
           GROUP BY DATE_FORMAT(pv.created_at, '%Y-%m-%d'), DATE_FORMAT(pv.created_at, '%d/%m')
           ORDER BY DATE_FORMAT(pv.created_at, '%Y-%m-%d') ASC`,
        );
        timelineStats = res || [];
      }
    } catch (e) {
      console.error("PageView timeline error:", e.message);
    }

    // 7. Thiết bị
    try {
      const [res] = await db.execute(
        `SELECT pv.device_type, COUNT(*) AS count FROM page_views pv ${whereClause} GROUP BY pv.device_type`,
      );
      deviceStatsRows = res || [];
    } catch (e) {
      console.error("PageView q6 error:", e.message);
    }

    // 8. Kênh nguồn truy cập (Organic, Social, Direct, NFC, Referral)
    try {
      const [res] = await db.execute(
        `SELECT 
           CASE 
             WHEN pv.page_path LIKE '/t/%' OR pv.utm_source = 'nfc' THEN 'Mã QR & Link Du Lịch'
             WHEN pv.referrer LIKE '%google.%' OR pv.referrer LIKE '%bing.%' OR pv.referrer LIKE '%yahoo.%' THEN 'Google / SEO'
             WHEN pv.referrer LIKE '%facebook.%' OR pv.referrer LIKE '%fb.me%' OR pv.referrer LIKE '%instagram.%' OR pv.referrer LIKE '%tiktok.%' OR pv.referrer LIKE '%youtube.%' OR pv.referrer LIKE '%zalo.%' THEN 'Mạng xã hội'
             WHEN pv.referrer IS NULL OR pv.referrer = '' THEN 'Trực tiếp / Direct'
             ELSE 'Website đối tác (Referral)'
           END AS channel_name,
           COUNT(*) AS count
         FROM page_views pv
         ${whereClause}
         GROUP BY channel_name
         ORDER BY count DESC`,
      );
      channelStatsRows = res || [];
    } catch (e) {
      console.error("PageView channel error:", e.message);
    }

    // 9. Top trang được xem nhiều nhất
    try {
      const [res] = await db.execute(
        `SELECT pv.page_path, COUNT(*) AS view_count, COUNT(DISTINCT pv.ip_address) AS unique_visitors
         FROM page_views pv
         ${whereClause}
         GROUP BY pv.page_path
         ORDER BY view_count DESC
         LIMIT 12`,
      );
      topPagesRows = res || [];
    } catch (e) {
      console.error("PageView top pages error:", e.message);
    }

    // 10. Top Tỉnh thành (Hiển thị đầy đủ các tỉnh thành trong hệ thống)
    try {
      const [res] = await db.execute(
        `SELECT pr.id, pr.name AS province_name, pr.slug AS province_slug, pr.region,
                COUNT(pv.id) AS view_count
         FROM provinces pr
         LEFT JOIN page_views pv ON (pv.province_slug = pr.slug)
         GROUP BY pr.id, pr.name, pr.slug, pr.region
         ORDER BY view_count DESC, pr.id ASC`,
      );
      topProvincesRows = res || [];
    } catch (e) {
      console.error("PageView q7 error:", e.message);
    }

    // 11. Top Referrers
    try {
      const [res] = await db.execute(
        `SELECT pv.referrer, COUNT(*) AS count
         FROM page_views pv
         ${whereClause ? `${whereClause} AND` : "WHERE"} pv.referrer IS NOT NULL AND pv.referrer != ''
         GROUP BY pv.referrer
         ORDER BY count DESC
         LIMIT 8`,
      );
      topReferrersRows = res || [];
    } catch (e) {
      console.error("PageView top referrers error:", e.message);
    }

    // 12. UTM Campaigns
    try {
      const [res] = await db.execute(
        `SELECT pv.utm_source, pv.utm_medium, pv.utm_campaign, COUNT(*) AS count
         FROM page_views pv
         ${whereClause ? `${whereClause} AND` : "WHERE"} pv.utm_source IS NOT NULL AND pv.utm_source != ''
         GROUP BY pv.utm_source, pv.utm_medium, pv.utm_campaign
         ORDER BY count DESC
         LIMIT 8`,
      );
      utmCampaignsRows = res || [];
    } catch (e) {
      console.error("PageView utm campaigns error:", e.message);
    }

    // 13. Nhật ký lượt xem gần nhất
    try {
      const [res] = await db.execute(
        `SELECT pv.id, pv.page_path, pv.province_slug, COALESCE(pr.name, pv.province_slug) AS province_name, 
                pv.ip_address, pv.device_type, pv.referrer, pv.utm_source, pv.created_at
         FROM page_views pv
         LEFT JOIN provinces pr ON (pv.province_slug = pr.slug)
         ORDER BY pv.created_at DESC
         LIMIT 20`,
      );
      recentViewsRows = res || [];
    } catch (e) {
      console.error("PageView q8 error:", e.message);
    }

    return {
      total_views: Number(totalViewsCount),
      unique_visitors: Number(uniqueVisitorsCount),
      today_views: Number(todayViewsCount),
      bot_blocked_count: Number(botBlockedCount),
      nfc_scans_count: Number(nfcScansCount),
      avg_duration_seconds: Number(avgDuration),
      timeline: timelineStats,
      device_stats: deviceStatsRows,
      channel_stats: channelStatsRows,
      top_pages: topPagesRows,
      top_provinces: topProvincesRows,
      top_referrers: topReferrersRows,
      utm_campaigns: utmCampaignsRows,
      recent_views: recentViewsRows,
    };
  },
};

module.exports = PageView;
