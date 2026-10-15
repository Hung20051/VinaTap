const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const pool = require("../config/db");

async function updateSources() {
  console.log("🌱 Bắt đầu cập nhật tỉ lệ nguồn truy cập trong MySQL (Direct 50%, Social 30%, SEO 15%, Referral 5%)...");

  // Lấy toàn bộ ID của page_views
  const [rows] = await pool.query("SELECT id FROM page_views ORDER BY id ASC");
  const total = rows.length;
  console.log(`Tổng số bản ghi page_views: ${total}`);

  const countDirect = Math.round(total * 0.50);    // 50%
  const countSocial = Math.round(total * 0.30);    // 30%
  const countSeo = Math.round(total * 0.15);       // 15%
  const countReferral = total - countDirect - countSocial - countSeo; // 5%

  console.log(`Phân bổ: Direct=${countDirect}, Social=${countSocial}, SEO=${countSeo}, Referral=${countReferral}`);

  const directIds = rows.slice(0, countDirect).map(r => r.id);
  const socialIds = rows.slice(countDirect, countDirect + countSocial).map(r => r.id);
  const seoIds = rows.slice(countDirect + countSocial, countDirect + countSocial + countSeo).map(r => r.id);
  const referralIds = rows.slice(countDirect + countSocial + countSeo).map(r => r.id);

  if (directIds.length > 0) {
    await pool.query(`UPDATE page_views SET referrer = NULL, utm_source = NULL, utm_medium = NULL WHERE id IN (${directIds.join(",")})`);
  }
  if (socialIds.length > 0) {
    await pool.query(`UPDATE page_views SET referrer = 'https://m.facebook.com/', utm_source = 'facebook', utm_medium = 'social' WHERE id IN (${socialIds.join(",")})`);
  }
  if (seoIds.length > 0) {
    await pool.query(`UPDATE page_views SET referrer = 'https://www.google.com.vn/', utm_source = 'google', utm_medium = 'organic' WHERE id IN (${seoIds.join(",")})`);
  }
  if (referralIds.length > 0) {
    await pool.query(`UPDATE page_views SET referrer = 'https://vinatap.vn/partner-portal', utm_source = 'partner', utm_medium = 'referral' WHERE id IN (${referralIds.join(",")})`);
  }

  // Kiểm tra kết quả
  const [channels] = await pool.query(`
    SELECT 
      CASE 
        WHEN referrer LIKE '%google.%' OR referrer LIKE '%bing.%' OR referrer LIKE '%yahoo.%' THEN 'Google Tìm Kiếm (SEO)'
        WHEN referrer LIKE '%facebook.%' OR referrer LIKE '%fb.me%' OR referrer LIKE '%instagram.%' OR referrer LIKE '%tiktok.%' OR referrer LIKE '%youtube.%' OR referrer LIKE '%zalo.%' THEN 'Mạng Xã Hội'
        WHEN referrer IS NULL OR referrer = '' THEN 'Truy Cập Trực Tiếp (Direct)'
        ELSE 'Website Đối Tác (Referral)'
      END AS channel_name,
      COUNT(*) AS count,
      ROUND(COUNT(*) * 100.0 / ${total}) AS pct
    FROM page_views
    GROUP BY channel_name
    ORDER BY count DESC
  `);

  console.log("✅ Kết quả thống kê kênh nguồn sau khi cập nhật:", channels);
  process.exit(0);
}

updateSources().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
