const db = require("../config/db");

// Regex phát hiện thiết bị Mobile / Tablet
const MOBILE_REGEX =
  /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i;

// Regex phát hiện Bot / Crawler tự động ngầm
const BOT_REGEX =
  /bot|crawl|spider|slurp|facebookexternalhit|python-requests|curl|wget|selenium|puppeteer/i;

const PageView = {
  // Ghi nhận lượt xem trang thực tế
  async track({ pagePath, provinceSlug, ipAddress, userAgent }) {

    const ua = userAgent || "";
    const isBot = BOT_REGEX.test(ua) ? 1 : 0; // Lọc bot ngầm an toàn
    const deviceType = MOBILE_REGEX.test(ua) ? "mobile" : "desktop";

    // Trích xuất province_slug nếu path dạng /province/:slug
    let slug = provinceSlug;
    if (!slug && pagePath && pagePath.startsWith("/province/")) {
      slug = pagePath.replace("/province/", "").split("?")[0].split("#")[0];
    }

    const [result] = await db.execute(
      `INSERT INTO page_views (page_path, province_slug, ip_address, user_agent, device_type, is_bot)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [pagePath, slug || null, ipAddress || null, ua, deviceType, isBot],
    );

    return { success: true, insertId: result?.insertId, deviceType, slug };
  },

  // Lấy thống kê chi tiết lượt truy cập
  async getAnalyticsStats(timeframe = "7days") {

    let whereClause = "WHERE pv.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    if (timeframe === "today") {
      whereClause = "WHERE DATE(pv.created_at) = CURDATE()";
    } else if (timeframe === "30days") {
      whereClause = "WHERE pv.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    } else if (timeframe === "all") {
      whereClause = "";
    }

    let totalViewsCount = 0;
    let uniqueVisitorsCount = 0;
    let todayViewsCount = 0;
    let botBlockedCount = 0;
    let nfcScansCount = 0;
    let deviceStatsRows = [];
    let topProvincesRows = [];
    let recentViewsRows = [];

    // 1. Tổng lượt xem trang
    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM page_views pv ${whereClause}`,
      );
      totalViewsCount = res[0]?.count || 0;
    } catch (e) {
      console.error("PageView q1 error:", e.message);
    }

    // 2. Khách xem độc nhất (Unique IP)
    try {
      const [res] = await db.execute(
        `SELECT COUNT(DISTINCT pv.ip_address) AS count FROM page_views pv ${whereClause}`,
      );
      uniqueVisitorsCount = res[0]?.count || 0;
    } catch (e) {
      console.error("PageView q2 error:", e.message);
    }

    // 3. Lượt xem trong ngày hôm nay
    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM page_views pv WHERE DATE(pv.created_at) = CURDATE()`,
      );
      todayViewsCount = res[0]?.count || 0;
    } catch (e) {
      console.error("PageView q3 error:", e.message);
    }

    // 4. Số lượt Spam/Bot đã lọc ngầm
    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM page_views pv WHERE pv.is_bot = 1`,
      );
      botBlockedCount = res[0]?.count || 0;
    } catch (e) {
      console.error("PageView q4 error:", e.message);
    }

    // 5. Số lượt quét thẻ NFC (/t/[token])
    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM page_views pv ${whereClause ? `${whereClause} AND` : "WHERE"} pv.page_path LIKE '/t/%'`,
      );
      nfcScansCount = res[0]?.count || 0;
    } catch (e) {
      console.error("PageView q5 error:", e.message);
    }

    // 6. Tỷ lệ thiết bị Mobile vs Desktop
    try {
      const [res] = await db.execute(
        `SELECT pv.device_type, COUNT(*) AS count FROM page_views pv ${whereClause} GROUP BY pv.device_type`,
      );
      deviceStatsRows = res || [];
    } catch (e) {
      console.error("PageView q6 error:", e.message);
    }

    // 7. Top các tỉnh thành được xem nhiều lượt nhất
    try {
      const [res] = await db.execute(
        `SELECT pv.province_slug, COUNT(*) AS view_count
         FROM page_views pv
         ${whereClause ? `${whereClause} AND` : "WHERE"} pv.province_slug IS NOT NULL AND pv.province_slug != ''
         GROUP BY pv.province_slug
         ORDER BY view_count DESC
         LIMIT 10`,
      );
      topProvincesRows = res || [];
    } catch (e) {
      console.error("PageView q7 error:", e.message);
    }

    // 8. Nhật ký 15 lượt xem người dùng mới nhất
    try {
      const [res] = await db.execute(
        `SELECT pv.id, pv.page_path, pv.province_slug, pv.ip_address, pv.device_type, pv.created_at
         FROM page_views pv
         ORDER BY pv.created_at DESC
         LIMIT 15`,
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
      device_stats: deviceStatsRows,
      top_provinces: topProvincesRows,
      recent_views: recentViewsRows,
    };
  },
};

module.exports = PageView;
