const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const db = require("../config/db");
const crypto = require("crypto");

const TARGET_PAGES = [
  // Homestay & Lưu trú mới (Nhóm trọng tâm)
  { path: "/stay/casa-blanca-da-lat", province: "lam-dong", count: 78 },
  { path: "/stay/casa-blanca", province: "lam-dong", count: 14 },
  { path: "/homestay/casa-blanca-da-lat", province: "lam-dong", count: 10 },

  // Cẩm nang du lịch mới xuất bản
  { path: "/guide/15-best-places-to-visit-in-vietnam-in-2026", province: null, count: 46 },
  { path: "/guide/3-week-vietnam-itinerary", province: null, count: 36 },
  { path: "/guide/15-best-attractions-in-dalat", province: "lam-dong", count: 28 },
  { path: "/guide/plan-your-vietnam-trip-with-just-one-prompt", province: null, count: 22 },
  { path: "/guide/10-best-things-to-do-in-ho-chi-minh-city", province: "ho-chi-minh", count: 18 },
  { path: "/guide/8-must-try-foods-in-hanoi", province: "ha-noi", count: 15 },
  { path: "/guide/the-complete-guide-to-vietnam", province: null, count: 12 },
  { path: "/guide/hanoi-tourist-map", province: "ha-noi", count: 10 },

  // Điểm đến & trang chủ
  { path: "/destinations/dalat", province: "lam-dong", count: 6 },
  { path: "/destinations/da-nang", province: "da-nang", count: 5 },
  { path: "/", province: null, count: 3 },
];

const REFERRERS = [
  { ref: "https://www.google.com.vn/", source: "google", medium: "organic", weight: 45 },
  { ref: "https://m.facebook.com/", source: "facebook", medium: "social", weight: 28 },
  { ref: null, source: null, medium: null, weight: 15 },
  { ref: "https://zalo.me/", source: "zalo", medium: "social", weight: 7 },
  { ref: "https://www.tiktok.com/", source: "tiktok", medium: "social", weight: 5 },
];

const DEVICES = [
  {
    type: "mobile",
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    weight: 70,
  },
  {
    type: "desktop",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    weight: 28,
  },
  {
    type: "tablet",
    ua: "Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    weight: 2,
  },
];

const IP_PREFIXES = ["113.161", "14.169", "171.244", "42.112", "27.72", "123.24", "1.53"];

function pickWeighted(items) {
  const total = items.reduce((a, b) => a + b.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    if (r < item.weight) return item;
    r -= item.weight;
  }
  return items[0];
}

function randomIp() {
  const p = IP_PREFIXES[Math.floor(Math.random() * IP_PREFIXES.length)];
  return `${p}.${Math.floor(Math.random() * 250) + 1}.${Math.floor(Math.random() * 250) + 1}`;
}

async function seedViews() {
  console.log("🌱 Bắt đầu tạo dữ liệu lượt xem...");

  // Tạo danh sách các bản ghi cần thêm
  const items = [];
  for (const item of TARGET_PAGES) {
    for (let i = 0; i < item.count; i++) {
      items.push({
        path: item.path,
        province: item.province,
      });
    }
  }

  // Phân bổ ngày theo mốc thời gian tăng dần tự nhiên (10/10 -> 14/10)
  // Tổng = 303 lượt
  // 10/10: 28 | 11/10: 42 | 12/10: 65 | 13/10: 82 | 14/10: 86
  const dateDistribution = [
    { day: "2026-10-10", count: 28 },
    { day: "2026-10-11", count: 42 },
    { day: "2026-10-12", count: 65 },
    { day: "2026-10-13", count: 82 },
    { day: "2026-10-14", count: 86 },
  ];

  const datePool = [];
  for (const dist of dateDistribution) {
    for (let i = 0; i < dist.count; i++) {
      datePool.push(dist.day);
    }
  }

  // Shuffle mảng items để phân bố ngẫu nhiên qua các ngày
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  let insertedCount = 0;
  for (let i = 0; i < items.length; i++) {
    const record = items[i];
    const dateStr = datePool[i] || "2026-10-14";

    const hour = Math.floor(Math.random() * 15) + 8; // 8:00 -> 23:00
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);
    const createdDate = `${dateStr} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;

    const dev = pickWeighted(DEVICES);
    const ref = pickWeighted(REFERRERS);
    const duration = Math.floor(Math.random() * 190) + 45; // 45s -> 235s
    const sessionId = crypto.randomBytes(16).toString("hex");
    const ip = randomIp();

    await db.execute(
      `INSERT INTO page_views 
       (page_path, province_slug, ip_address, user_agent, device_type, is_bot, referrer, utm_source, utm_medium, session_id, duration_seconds, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?)`,
      [
        record.path,
        record.province,
        ip,
        dev.ua,
        dev.type,
        ref.ref,
        ref.source,
        ref.medium,
        sessionId,
        duration,
        createdDate,
      ]
    );
    insertedCount++;
  }

  const [[totalRow]] = await db.execute("SELECT COUNT(*) AS total FROM page_views");
  console.log(`✅ Đã thêm thành công ${insertedCount} lượt xem mới!`);
  console.log(`📊 Tổng lượt xem hiện tại trong database: ${totalRow.total}`);

  // Cập nhật views_count tương ứng vào bảng articles nếu có
  for (const page of TARGET_PAGES) {
    if (page.path.startsWith("/guide/")) {
      const slug = page.path.replace("/guide/", "").split("?")[0];
      await db.execute(
        `UPDATE articles SET views_count = views_count + ? WHERE slug = ?`,
        [page.count, slug]
      ).catch(() => {});
    }
  }

  process.exit(0);
}

seedViews().catch((err) => {
  console.error("❌ Lỗi khi seed views:", err);
  process.exit(1);
});
