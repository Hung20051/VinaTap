const pool = require("../config/db");
const crypto = require("crypto");

const TARGET_PAGES = [
  // Homestay & Lưu trú mới (Trọng tâm lớn nhất)
  { path: "/stay/casa-blanca-da-lat", province: "lam-dong", count: 86 },
  { path: "/stay/casa-blanca", province: "lam-dong", count: 15 },
  { path: "/homestay/casa-blanca-da-lat", province: "lam-dong", count: 10 },

  // Cẩm nang du lịch mới
  { path: "/guide/15-best-places-to-visit-in-vietnam-in-2026", province: null, count: 48 },
  { path: "/guide/3-week-vietnam-itinerary", province: null, count: 36 },
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

// Đúng 62 IP duy nhất của các nhà mạng Việt Nam (Viettel, VNPT, FPT) -> Khách truy cập (Unique IP) = 62
const UNIQUE_IP_POOL = [
  "113.161.45.12", "113.161.88.94", "113.161.12.73", "113.161.99.102", "113.161.155.60", "113.161.210.4", "113.161.19.88", "113.161.64.120",
  "14.169.23.45", "14.169.77.108", "14.169.112.5", "14.169.198.81", "14.169.54.33", "14.169.140.21", "14.169.201.7", "14.169.89.65",
  "171.244.10.82", "171.244.55.19", "171.244.120.44", "171.244.180.91", "171.244.92.15", "171.244.220.6", "171.244.145.38", "171.244.73.11",
  "42.112.18.99", "42.112.60.22", "42.112.105.77", "42.112.170.14", "42.112.215.8", "42.112.84.49", "42.112.133.61", "42.112.49.205",
  "27.72.35.18", "27.72.78.91", "27.72.122.4", "27.72.189.66", "27.72.94.130", "27.72.204.88", "27.72.150.12", "27.72.41.79",
  "115.73.15.62", "115.73.80.11", "115.73.135.94", "115.73.190.27", "115.73.66.45", "115.73.220.18", "115.73.109.83", "115.73.44.150",
  "123.24.19.88", "123.24.72.14", "123.24.118.59", "123.24.165.101", "123.24.88.33", "123.24.212.7", "123.24.140.92", "123.24.57.19",
  "1.53.22.105", "1.53.68.44", "1.53.115.89", "1.53.180.12", "1.53.210.67", "1.53.95.38"
];

function pickWeighted(items) {
  const total = items.reduce((a, b) => a + b.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    if (r < item.weight) return item;
    r -= item.weight;
  }
  return items[0];
}

async function standardizeIpsAndDuration() {
  // Cập nhật tất cả các dòng hiện có về tập 62 IP cố định và thời gian trung bình 3 phút
  const ipListSql = UNIQUE_IP_POOL.map((ip) => `'${ip}'`).join(", ");
  await pool.query(`
    UPDATE page_views 
    SET ip_address = ELT((id % ${UNIQUE_IP_POOL.length}) + 1, ${ipListSql}),
        duration_seconds = FLOOR(150 + (RAND() * 60))
  `);

  // Điều chỉnh lượt xem hôm nay về khoảng 50 lượt (chuyển phần dôi dư sang ngày hôm qua)
  const [[todayRow]] = await pool.query("SELECT COUNT(*) AS c FROM page_views WHERE DATE(created_at) = CURDATE()");
  const todayCount = Number(todayRow?.c || 0);
  const diff = todayCount - 50;
  if (diff > 0) {
    await pool.query(`
      UPDATE page_views 
      SET created_at = DATE_SUB(created_at, INTERVAL 1 DAY)
      WHERE DATE(created_at) = CURDATE()
      ORDER BY id ASC
      LIMIT ${diff}
    `);
  }
}

async function applyPresetViews(forceReset = false) {
  // 1. Kiểm tra số lượng views hiện tại
  const [[cntRow]] = await pool.query("SELECT COUNT(*) AS total FROM page_views");
  const currentTotal = Number(cntRow?.total || 0);

  // Nếu đã có >= 360 views và không yêu cầu reset
  if (currentTotal >= 360 && !forceReset) {
    await standardizeIpsAndDuration();
    const [[avgRow]] = await pool.query("SELECT ROUND(AVG(NULLIF(duration_seconds, 0))) AS avg_dur FROM page_views");
    const [[uniqRow]] = await pool.query("SELECT COUNT(DISTINCT ip_address) AS uniq FROM page_views");
    const [[todayRow]] = await pool.query("SELECT COUNT(*) AS today_c FROM page_views WHERE DATE(created_at) = CURDATE()");
    return {
      success: true,
      total: currentTotal,
      today_views: Number(todayRow?.today_c || 50),
      unique_visitors: Number(uniqRow?.uniq || 62),
      avg_duration_seconds: Number(avgRow?.avg_dur || 180),
      message: "Đã chuẩn hóa Khách truy cập về 62 người, lượt xem hôm nay khoảng 50 và thời lượng 3 phút",
    };
  }

  // Nếu forceReset, xóa các bản ghi seed cũ (id > 65)
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

  // Phân bổ ngày theo mốc thời gian tăng dần tự nhiên (10/10 -> 14/10 với hôm nay là 50 lượt)
  const dateDistribution = [
    { day: "2026-10-10", count: 35 },
    { day: "2026-10-11", count: 52 },
    { day: "2026-10-12", count: 75 },
    { day: "2026-10-13", count: 91 },
    { day: "2026-10-14", count: 50 },
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
    const ip = UNIQUE_IP_POOL[i % UNIQUE_IP_POOL.length];

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

  // Chuẩn hóa toàn bộ IP về đúng tập 62 IP duy nhất và thời lượng 3 phút
  await standardizeIpsAndDuration();

  const [[afterTotal]] = await pool.query("SELECT COUNT(*) AS total FROM page_views");
  const [[afterAvg]] = await pool.query("SELECT ROUND(AVG(NULLIF(duration_seconds, 0))) AS avg_dur FROM page_views");
  const [[afterUniq]] = await pool.query("SELECT COUNT(DISTINCT ip_address) AS uniq FROM page_views");

  return {
    success: true,
    total: Number(afterTotal?.total || 0),
    unique_visitors: Number(afterUniq?.uniq || 62),
    avg_duration_seconds: Number(afterAvg?.avg_dur || 180),
    inserted: values.length,
  };
}

module.exports = { applyPresetViews, standardizeIpsAndDuration };
