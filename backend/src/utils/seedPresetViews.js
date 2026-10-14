const pool = require("../config/db");
const crypto = require("crypto");

const TARGET_PAGES = [
  // Homestay & Lưu trú mới (Trọng tâm lớn nhất)
  { path: "/stay/casa-blanca-da-lat", province: "lam-dong", count: 82 },
  { path: "/stay/casa-blanca", province: "lam-dong", count: 15 },
  { path: "/homestay/casa-blanca-da-lat", province: "lam-dong", count: 10 },

  // Cẩm nang du lịch mới
  { path: "/guide/15-best-places-to-visit-in-vietnam-in-2026", province: null, count: 45 },
  { path: "/guide/3-week-vietnam-itinerary", province: null, count: 35 },
  { path: "/guide/15-best-attractions-in-dalat", province: "lam-dong", count: 28 },
  { path: "/guide/plan-your-vietnam-trip-with-just-one-prompt", province: null, count: 22 },
  { path: "/guide/10-best-things-to-do-in-ho-chi-minh-city", province: "ho-chi-minh", count: 18 },
  { path: "/guide/8-must-try-foods-in-hanoi", province: "ha-noi", count: 15 },
  { path: "/guide/the-complete-guide-to-vietnam", province: null, count: 12 },
  { path: "/guide/hanoi-tourist-map", province: "ha-noi", count: 10 },

  // Điểm đến
  { path: "/destinations/dalat", province: "lam-dong", count: 6 },
  { path: "/destinations/da-nang", province: "da-nang", count: 5 },
];

// Nguồn khách: Facebook & Link trực tiếp là chính, Google SEO rất ít
const REFERRERS = [
  { ref: "https://m.facebook.com/", source: "facebook", medium: "social", weight: 55 },
  { ref: null, source: null, medium: null, weight: 36 },
  { ref: "https://www.google.com.vn/", source: "google", medium: "organic", weight: 6 },
  { ref: "https://zalo.me/", source: "zalo", medium: "social", weight: 3 },
];

// Thiết bị: Đa phần là điện thoại (~88%), máy tính (~10%), tablet (~2%)
const DEVICES = [
  {
    type: "mobile",
    ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
    weight: 88,
  },
  {
    type: "desktop",
    ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    weight: 10,
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

async function applyPresetViews(forceReset = false) {
  // 1. Kiểm tra số lượng views hiện tại
  const [[cntRow]] = await pool.query("SELECT COUNT(*) AS total FROM page_views");
  const currentTotal = Number(cntRow?.total || 0);

  // Nếu đã có >= 360 views và không yêu cầu reset, chỉ cần cập nhật duration_seconds về ~180s (3 phút)
  if (currentTotal >= 360 && !forceReset) {
    // Điều chỉnh duration của các bản ghi seeded để trung bình đúng 3 phút (180 giây)
    await pool.query(`
      UPDATE page_views 
      SET duration_seconds = FLOOR(150 + (RAND() * 60))
      WHERE id > 65
    `);
    const [[avgRow]] = await pool.query("SELECT ROUND(AVG(NULLIF(duration_seconds, 0))) AS avg_dur FROM page_views");
    return {
      success: true,
      total: currentTotal,
      avg_duration_seconds: Number(avgRow?.avg_dur || 180),
      message: "Dữ liệu đã đạt 360+ lượt xem và đã chuẩn hóa thời gian trung bình 3 phút",
    };
  }

  // Nếu forceReset hoặc cần bù thêm, xóa các bản ghi seed cũ (id > 65)
  if (forceReset) {
    await pool.query("DELETE FROM page_views WHERE id > 65");
  }

  const items = [];
  for (const page of TARGET_PAGES) {
    for (let i = 0; i < page.count; i++) {
      items.push({
        path: page.path,
        province: page.province,
      });
    }
  }

  // Phân bổ ngày theo mốc thời gian tăng dần tự nhiên (10/10 -> 14/10)
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

  // Shuffle mảng items
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  const values = [];
  for (let i = 0; i < items.length; i++) {
    const record = items[i];
    const dateStr = datePool[i] || "2026-10-14";

    const hour = Math.floor(Math.random() * 15) + 8; // 8h -> 23h
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);
    const createdDate = `${dateStr} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;

    const dev = pickWeighted(DEVICES);
    const ref = pickWeighted(REFERRERS);
    // Thời gian trung bình: 180s (~3 phút), dao động 150s - 210s
    const duration = Math.floor(Math.random() * 60) + 150;
    const sessionId = crypto.randomBytes(16).toString("hex");
    const ip = randomIp();

    values.push([
      record.path,
      record.province,
      ip,
      dev.ua,
      dev.type,
      0, // is_bot = 0
      ref.ref,
      ref.source,
      ref.medium,
      sessionId,
      duration,
      createdDate,
    ]);
  }

  // Bulk INSERT
  const sql = `
    INSERT INTO page_views 
    (page_path, province_slug, ip_address, user_agent, device_type, is_bot, referrer, utm_source, utm_medium, session_id, duration_seconds, created_at)
    VALUES ?
  `;
  await pool.query(sql, [values]);

  // Đồng thời cập nhật các bản ghi gốc ban đầu về thời gian ~3 phút
  await pool.query(`
    UPDATE page_views 
    SET duration_seconds = FLOOR(150 + (RAND() * 60))
    WHERE duration_seconds < 100 OR duration_seconds IS NULL
  `);

  const [[afterTotal]] = await pool.query("SELECT COUNT(*) AS total FROM page_views");
  const [[afterAvg]] = await pool.query("SELECT ROUND(AVG(NULLIF(duration_seconds, 0))) AS avg_dur FROM page_views");

  return {
    success: true,
    total: Number(afterTotal?.total || 0),
    avg_duration_seconds: Number(afterAvg?.avg_dur || 180),
    inserted: values.length,
  };
}

module.exports = { applyPresetViews };
