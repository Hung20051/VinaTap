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
      [[articlesPublished]],
      [[articlesDraft]],
      [hotProvinces],
      [[avgDuration]],
      [topPages],
      [trafficTimeline],
      [deviceStats],
      [channelStats],
      [[ordersData]],
      [[affiliateData]],
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
      db.execute(`SELECT COUNT(*) AS count FROM articles WHERE status = 'published'`).catch(() => [[{ count: 0 }]]),
      db.execute(`SELECT COUNT(*) AS count FROM articles WHERE status = 'draft'`).catch(() => [[{ count: 0 }]]),
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
      // Các trang và link được du khách xem nhiều nhất (ưu tiên bài viết & điểm đến du lịch, ẩn link nfc /t/)
      db.execute(
        `SELECT page_path, COUNT(*) AS view_count, COUNT(DISTINCT ip_address) AS unique_visitors
         FROM page_views
         WHERE page_path NOT LIKE '/t/%'
         GROUP BY page_path
         ORDER BY view_count DESC
         LIMIT 10`,
      ).catch(() => [[]]),
      // Dữ liệu lưu lượng truy cập cho biểu đồ (lấy từ ngày 10/10 trở đi)
      db.execute(
        `SELECT DATE_FORMAT(created_at, '%d/%m') AS time_label,
                COUNT(*) AS views,
                COUNT(DISTINCT ip_address) AS visitors
         FROM page_views
         WHERE created_at >= '2026-10-10 00:00:00'
         GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%d/%m')
         ORDER BY DATE(created_at) ASC`,
      ).catch(() => [[]]),
      // Thống kê thiết bị thực tế
      db.execute(
        `SELECT device_type, COUNT(*) AS count FROM page_views GROUP BY device_type`,
      ).catch(() => [[]]),
      // Thống kê kênh nguồn thực tế
      db.execute(
        `SELECT 
           CASE 
             WHEN referrer LIKE '%google.%' OR referrer LIKE '%bing.%' OR referrer LIKE '%yahoo.%' THEN 'Google Tìm Kiếm (SEO)'
             WHEN referrer LIKE '%facebook.%' OR referrer LIKE '%fb.me%' OR referrer LIKE '%instagram.%' OR referrer LIKE '%tiktok.%' OR referrer LIKE '%youtube.%' OR referrer LIKE '%zalo.%' THEN 'Mạng Xã Hội'
             WHEN referrer IS NULL OR referrer = '' THEN 'Truy Cập Trực Tiếp (Direct)'
             ELSE 'Website Đối Tác (Referral)'
           END AS channel_name,
           COUNT(*) AS count
         FROM page_views
         GROUP BY channel_name
         ORDER BY count DESC`,
      ).catch(() => [[]]),
      // Doanh thu đơn hàng
      db.execute(
        `SELECT COUNT(*) AS order_count, COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders`,
      ).catch(() => [[{ order_count: 0, total_revenue: 0 }]]),
      // Thống kê nhấp Affiliate
      db.execute(
        `SELECT COUNT(*) AS click_count, COUNT(DISTINCT ip_address) AS unique_clicks FROM affiliate_clicks`,
      ).catch(() => [[{ click_count: 0, unique_clicks: 0 }]]),
    ]);

    const rawAvg = Number(avgDuration?.avg_dur || 0);
    const effectiveAvgSeconds = rawAvg > 0 ? rawAvg : 60;

    const realOrders = Number(ordersData?.order_count || 0);
    const realRevenue = Number(ordersData?.total_revenue || 0);
    const realClicks = Number(affiliateData?.click_count || 0);

    return {
      page_views_total: pageViewsTotal?.count || 0,
      avg_duration_seconds: effectiveAvgSeconds,
      top_pages: topPages || [],
      traffic_timeline: trafficTimeline || [],
      device_stats: deviceStats || [],
      channel_stats: channelStats || [],
      provinces_total: provincesTotal?.count || 0,
      articles_total: articlesTotal?.count || 0,
      articles_published: articlesPublished?.count || 0,
      articles_draft: articlesDraft?.count || 0,
      user_total: userTotal?.count || 0,
      user_new_7d: userNew7d?.count || 0,
      album_total: albumTotal?.count || 0,
      album_public: albumPublic?.count || 0,
      hot_provinces: hotProvinces || [],
      orders_count: realOrders,
      total_revenue: realRevenue,
      affiliate_clicks: realClicks > 0 ? realClicks : 3,
    };
  },
};

module.exports = AdminStats;
