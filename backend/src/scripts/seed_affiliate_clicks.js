const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const pool = require("../config/db");

const AFFILIATE_DATA = [
  // Klook (22 clicks)
  {
    partner: "klook",
    title: "Tour lặn biển ngắm san hô Đảo Hòn Mun (Nha Trang)",
    url: "https://www.klook.com/vi/activity/hon-mun-island-diving/",
    path: "/guide/8-best-things-to-do-in-nha-trang",
    count: 14,
  },
  {
    partner: "klook",
    title: "Vé Sun World Ba Na Hills Đà Nẵng",
    url: "https://www.klook.com/vi/activity/ba-na-hills-ticket/",
    path: "/guide/15-best-places-to-visit-in-vietnam-in-2026",
    count: 8,
  },

  // Traveloka (15 clicks)
  {
    partner: "traveloka",
    title: "Casa Blanca Đà Lạt Homestay (Phòng Deluxe)",
    url: "https://www.traveloka.com/vi-vn/hotel/vietnam/casa-blanca-da-lat/",
    path: "/stay/casa-blanca-da-lat",
    count: 9,
  },
  {
    partner: "traveloka",
    title: "Vé xe Limousine Sài Gòn - Vũng Tàu",
    url: "https://www.traveloka.com/vi-vn/bus-and-shuttle/saigon-vungtau/",
    path: "/guide/7-must-try-foods-in-vung-tau",
    count: 6,
  },

  // Agoda (11 clicks)
  {
    partner: "agoda",
    title: "Khách sạn Mường Thanh Luxury Nha Trang",
    url: "https://www.agoda.com/muong-thanh-luxury-nha-trang/",
    path: "/guide/8-best-things-to-do-in-nha-trang",
    count: 6,
  },
  {
    partner: "agoda",
    title: "Vinpearl Resort & Spa Nha Trang Bay",
    url: "https://www.agoda.com/vinpearl-resort-spa-nha-trang/",
    path: "/guide/8-best-things-to-do-in-nha-trang",
    count: 5,
  },
];

// 38 unique IPs
const IPS = [
  "113.161.45.12", "113.161.88.94", "113.161.12.73", "113.161.99.102", "113.161.155.60",
  "14.169.23.45", "14.169.77.108", "14.169.112.5", "14.169.198.81", "14.169.54.33",
  "171.244.10.82", "171.244.55.19", "171.244.120.44", "171.244.180.91", "171.244.92.15",
  "42.112.18.99", "42.112.60.22", "42.112.105.77", "42.112.170.14", "42.112.215.8",
  "27.72.35.18", "27.72.78.91", "27.72.122.4", "27.72.189.66", "27.72.94.130",
  "115.73.15.62", "115.73.80.11", "115.73.135.94", "115.73.190.27", "115.73.66.45",
  "123.24.19.88", "123.24.72.14", "123.24.118.59", "123.24.165.101", "123.24.88.33",
  "1.53.22.105", "1.53.68.44", "1.53.115.89"
];

// Dates from 10/10/2026 onwards
const DATES = [
  "2026-10-10", "2026-10-11", "2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15"
];

async function seedAffiliate() {
  console.log("🌱 Bắt đầu tạo dữ liệu lượt click Affiliate...");

  // Xóa dữ liệu cũ nếu có
  await pool.query("DELETE FROM affiliate_clicks");

  const rows = [];
  let ipIndex = 0;
  let dateIndex = 0;

  for (const item of AFFILIATE_DATA) {
    for (let i = 0; i < item.count; i++) {
      const ip = IPS[ipIndex % IPS.length];
      ipIndex++;

      const dateStr = DATES[dateIndex % DATES.length];
      dateIndex++;

      const hour = Math.floor(Math.random() * 14) + 9; // 9:00 -> 22:00
      const min = Math.floor(Math.random() * 60);
      const sec = Math.floor(Math.random() * 60);
      const createdAt = `${dateStr} ${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

      const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";

      rows.push([
        item.path,
        item.partner,
        item.url,
        item.title,
        ip,
        ua,
        createdAt,
      ]);
    }
  }

  const sql = `
    INSERT INTO affiliate_clicks 
    (page_path, partner_name, destination_url, link_title, ip_address, user_agent, created_at)
    VALUES ?
  `;

  await pool.query(sql, [rows]);
  console.log(`✅ Đã thêm thành công ${rows.length} lượt click Affiliate đối tác Klook, Traveloka, Agoda!`);

  // Kiểm tra kết quả
  const [stats] = await pool.query(`
    SELECT COUNT(*) as total_clicks, COUNT(DISTINCT ip_address) as unique_users
    FROM affiliate_clicks
  `);
  console.log("Thống kê Affiliate hiện tại:", stats[0]);

  const [partners] = await pool.query(`
    SELECT partner_name, COUNT(*) as count
    FROM affiliate_clicks
    GROUP BY partner_name
    ORDER BY count DESC
  `);
  console.log("Phân bổ theo đối tác:", partners);

  process.exit(0);
}

seedAffiliate().catch((err) => {
  console.error("❌ Lỗi:", err);
  process.exit(1);
});
