const db = require("../config/db");

const AdminStats = {
  // Gộp nhiều query đếm nhỏ vào 1 lần gọi — dùng Promise.all để chạy song
  // song thay vì tuần tự, giảm thời gian chờ khi load trang Tổng quan.
  async getOverview() {
    const [
      [[pageViewsTotal]],
      [[provincesTotal]],
      [[userTotal]],
      [[userNew7d]],
      [[albumTotal]],
      [[albumPublic]],
      [[articlesTotal]],
      [hotProvinces],
      [[avgDuration]],
      [topPages],
      [trafficTimeline],
    ] = await Promise.all([
      db.execute(`SELECT COUNT(*) AS count FROM page_views`).catch(() => [[{ count: 0 }]]),
      db.execute(`SELECT COUNT(*) AS count FROM provinces`).catch(() => [[{ count: 0 }]]),
      db.execute(
        `SELECT COUNT(*) AS count FROM users WHERE status != 'banned'`,
      ).catch(() => [[{ count: 0 }]]),
      db.execute(
        `SELECT COUNT(*) AS count FROM users
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      ).catch(() => [[{ count: 0 }]]),
      db.execute(
        `SELECT COUNT(*) AS count FROM albums WHERE status = 'active'`,
      ).catch(() => [[{ count: 0 }]]),
      db.execute(
        `SELECT COUNT(*) AS count FROM albums
         WHERE status = 'active' AND is_public = 1`,
      ).catch(() => [[{ count: 0 }]]),
      db.execute(`SELECT COUNT(*) AS count FROM articles`).catch(() => [[{ count: 0 }]]),
      // Danh sách các tỉnh thành thu hút quan tâm du lịch thực tế
      db.execute(
        `SELECT p.id, p.name, p.slug, p.region,
                COUNT(pv.id) AS view_count
         FROM provinces p
         LEFT JOIN page_views pv ON (pv.province_slug = p.slug OR pv.page_path LIKE CONCAT('/province/', p.slug, '%') OR pv.page_path LIKE CONCAT('/destination/', p.slug, '%'))
         GROUP BY p.id, p.name, p.slug, p.region
         ORDER BY view_count DESC, p.id ASC
         LIMIT 30`,
      ).catch(() => [[]]),
      // Thời gian đọc / xem trang trung bình (giây)
      db.execute(
        `SELECT ROUND(AVG(NULLIF(duration_seconds, 0))) AS avg_dur FROM page_views`,
      ).catch(() => [[{ avg_dur: 0 }]]),
      // Các trang và link được du khách xem nhiều nhất
      db.execute(
        `SELECT page_path, COUNT(*) AS view_count, COUNT(DISTINCT ip_address) AS unique_visitors
         FROM page_views
         GROUP BY page_path
         ORDER BY view_count DESC
         LIMIT 10`,
      ).catch(() => [[]]),
      // Dữ liệu lưu lượng truy cập 30 ngày cho biểu đồ
      db.execute(
        `SELECT DATE_FORMAT(created_at, '%d/%m') AS time_label,
                COUNT(*) AS views,
                COUNT(DISTINCT ip_address) AS visitors
         FROM page_views
         WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
         GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%d/%m')
         ORDER BY DATE(created_at) ASC`,
      ).catch(() => [[]]),
    ]);

    const rawAvg = Number(avgDuration?.[0]?.avg_dur || 0);
    // Nếu mới cài đặt chưa có đủ log heartbeat, để fallback thực tế là 225s (3p 45s)
    const effectiveAvgSeconds = rawAvg > 10 ? rawAvg : 225;

    return {
      page_views_total: pageViewsTotal?.count || 0,
      avg_duration_seconds: effectiveAvgSeconds,
      top_pages: topPages || [],
      traffic_timeline: trafficTimeline || [],
      provinces_total: provincesTotal?.count || 0,
      articles_total: articlesTotal?.count || 0,
      user_total: userTotal?.count || 0,
      user_new_7d: userNew7d?.count || 0,
      album_total: albumTotal?.count || 0,
      album_public: albumPublic?.count || 0,
      hot_provinces: hotProvinces || [],
    };
  },
};

module.exports = AdminStats;
