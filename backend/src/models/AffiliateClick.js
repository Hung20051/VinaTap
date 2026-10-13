const db = require("../config/db");

const AffiliateClick = {
  // Ghi nhận lượt click liên kết đối tác
  async trackClick({
    pagePath,
    partnerName,
    destinationUrl,
    linkTitle,
    ipAddress,
    userAgent,
  }) {
    if (!pagePath || !destinationUrl) {
      throw new Error("Thiếu pagePath hoặc destinationUrl");
    }

    const cleanPath = (pagePath || "").slice(0, 255);
    const cleanPartner = (partnerName || "other").toLowerCase().slice(0, 100);
    const cleanTitle = (linkTitle || "").slice(0, 255);
    const cleanUrl = destinationUrl.slice(0, 1000);
    const ua = (userAgent || "").slice(0, 500);

    const [result] = await db.execute(
      `INSERT INTO affiliate_clicks 
       (page_path, partner_name, destination_url, link_title, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cleanPath, cleanPartner, cleanUrl, cleanTitle, ipAddress || null, ua],
    );

    return { success: true, insertId: result?.insertId, partner: cleanPartner };
  },

  // Lấy thống kê chi tiết lượt click Affiliate cho Admin
  async getAffiliateStats(timeframe = "7days") {
    let whereClause = "WHERE ac.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    if (timeframe === "today") {
      whereClause = "WHERE DATE(ac.created_at) = CURDATE()";
    } else if (timeframe === "30days") {
      whereClause = "WHERE ac.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    } else if (timeframe === "all") {
      whereClause = "";
    }

    let totalClicks = 0;
    let uniqueUsers = 0;
    let clicksByPartner = [];
    let topClickedLinks = [];
    let topPagesWithClicks = [];
    let recentClicks = [];

    // 1. Tổng lượt click
    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count, COUNT(DISTINCT ac.ip_address) AS unique_count 
         FROM affiliate_clicks ac ${whereClause}`,
      );
      totalClicks = res[0]?.count || 0;
      uniqueUsers = res[0]?.unique_count || 0;
    } catch (e) {
      console.error("AffiliateClick q1 error:", e.message);
    }

    // 2. Click theo đối tác
    try {
      const [res] = await db.execute(
        `SELECT ac.partner_name, COUNT(*) AS count 
         FROM affiliate_clicks ac 
         ${whereClause} 
         GROUP BY ac.partner_name 
         ORDER BY count DESC`,
      );
      clicksByPartner = res || [];
    } catch (e) {
      console.error("AffiliateClick q2 error:", e.message);
    }

    // 3. Top liên kết được click nhiều nhất
    try {
      const [res] = await db.execute(
        `SELECT ac.link_title, ac.destination_url, ac.partner_name, COUNT(*) AS count 
         FROM affiliate_clicks ac 
         ${whereClause} 
         GROUP BY ac.link_title, ac.destination_url, ac.partner_name 
         ORDER BY count DESC 
         LIMIT 10`,
      );
      topClickedLinks = res || [];
    } catch (e) {
      console.error("AffiliateClick q3 error:", e.message);
    }

    // 4. Top trang có nhiều click affiliate nhất
    try {
      const [res] = await db.execute(
        `SELECT ac.page_path, COUNT(*) AS count 
         FROM affiliate_clicks ac 
         ${whereClause} 
         GROUP BY ac.page_path 
         ORDER BY count DESC 
         LIMIT 10`,
      );
      topPagesWithClicks = res || [];
    } catch (e) {
      console.error("AffiliateClick q4 error:", e.message);
    }

    // 5. Nhật ký 20 click gần nhất
    try {
      const [res] = await db.execute(
        `SELECT ac.id, ac.page_path, ac.partner_name, ac.link_title, ac.destination_url, ac.ip_address, ac.created_at 
         FROM affiliate_clicks ac 
         ORDER BY ac.created_at DESC 
         LIMIT 20`,
      );
      recentClicks = res || [];
    } catch (e) {
      console.error("AffiliateClick q5 error:", e.message);
    }

    return {
      total_clicks: Number(totalClicks),
      unique_users: Number(uniqueUsers),
      clicks_by_partner: clicksByPartner,
      top_clicked_links: topClickedLinks,
      top_pages_with_clicks: topPagesWithClicks,
      recent_clicks: recentClicks,
    };
  },
};

module.exports = AffiliateClick;
