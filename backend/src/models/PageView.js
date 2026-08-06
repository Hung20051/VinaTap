const db = require("../config/db");

// Regex phát hiện thiết bị Mobile / Tablet
const MOBILE_REGEX =
  /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i;

const PageView = {
  async initTable() {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS page_views (
          id INT AUTO_INCREMENT PRIMARY KEY,
          page_path VARCHAR(255) NOT NULL,
          province_slug VARCHAR(100) NULL,
          ip_address VARCHAR(45) NULL,
          user_agent TEXT NULL,
          device_type VARCHAR(20) DEFAULT 'desktop',
          is_bot TINYINT(1) DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_created_at (created_at),
          INDEX idx_is_bot (is_bot),
          INDEX idx_province_slug (province_slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    } catch (err) {
      console.error("PageView initTable error:", err.message);
    }
  },

  // Ghi nhận lượt xem trang thực tế
  async track({ pagePath, provinceSlug, ipAddress, userAgent }) {
    await this.initTable();

    const ua = userAgent || "";
    const isBot = 0; // Đã tắt lọc bot — đếm 100% tất cả lượt xem
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

    return { success: true, insertId: result.insertId, deviceType, slug };
  },

  // Lấy thống kê chi tiết lượt truy cập (ĐÃ CHUẨN HÓA BẢNG PV TRÁNH LỖI CỘT AMBIGUOUS)
  async getAnalyticsStats(timeframe = "7days") {
    await this.initTable();

    let whereClause = "WHERE pv.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    if (timeframe === "today") {
      whereClause = "WHERE DATE(pv.created_at) = CURDATE()";
    } else if (timeframe === "30days") {
      whereClause = "WHERE pv.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    } else if (timeframe === "all") {
      whereClause = "";
    }

    const whereJoinPrefix = whereClause ? `${whereClause} AND` : "WHERE";

    const [
      [[totalViews]],
      [[uniqueVisitors]],
      [[todayViews]],
      [[botBlocked]],
      [deviceStats],
      [topProvinces],
      [recentViews],
    ] = await Promise.all([
      // 1. Tổng lượt xem trang
      db.execute(`SELECT COUNT(*) AS count FROM page_views pv ${whereClause}`),

      // 2. Khách xem độc nhất (Unique IP)
      db.execute(
        `SELECT COUNT(DISTINCT pv.ip_address) AS count FROM page_views pv ${whereClause}`,
      ),

      // 3. Lượt xem trong ngày hôm nay
      db.execute(
        `SELECT COUNT(*) AS count FROM page_views pv WHERE DATE(pv.created_at) = CURDATE()`,
      ),

      // 4. Số lượt Spam/Bot
      db.execute(`SELECT COUNT(*) AS count FROM page_views pv WHERE pv.is_bot = 1`),

      // 5. Tỷ lệ thiết bị Mobile vs Desktop
      db.execute(
        `SELECT pv.device_type, COUNT(*) AS count FROM page_views pv ${whereClause} GROUP BY pv.device_type`,
      ),

      // 6. Top các tỉnh thành được xem nhiều lượt nhất
      db.execute(
        `SELECT pv.province_slug, MAX(p.name) AS province_name, COUNT(*) AS view_count
         FROM page_views pv
         LEFT JOIN provinces p ON p.slug = pv.province_slug
         ${whereJoinPrefix} pv.province_slug IS NOT NULL AND pv.province_slug != ''
         GROUP BY pv.province_slug
         ORDER BY view_count DESC
         LIMIT 10`,
      ),

      // 7. Nhật ký 15 lượt xem người dùng mới nhất
      db.execute(
        `SELECT pv.id, pv.page_path, pv.province_slug, pv.ip_address, pv.device_type, pv.created_at, p.name AS province_name
         FROM page_views pv
         LEFT JOIN provinces p ON p.slug = pv.province_slug
         ORDER BY pv.created_at DESC
         LIMIT 15`,
      ),
    ]);

    return {
      total_views: Number(totalViews?.count || 0),
      unique_visitors: Number(uniqueVisitors?.count || 0),
      today_views: Number(todayViews?.count || 0),
      bot_blocked_count: Number(botBlocked?.count || 0),
      device_stats: deviceStats || [],
      top_provinces: topProvinces || [],
      recent_views: recentViews || [],
    };
  },
};

module.exports = PageView;
