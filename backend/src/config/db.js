const mysql = require("mysql2/promise");

const sslConfig =
  process.env.DB_SSL === "true" ||
  process.env.DB_SSL === "REQUIRED" ||
  (process.env.DB_HOST && process.env.DB_HOST.includes("aivencloud.com"))
    ? { rejectUnauthorized: false }
    : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+07:00",
});

// Test kết nối khi khởi động (có cơ chế thử lại nếu đang bận/khởi động)
async function testConnection(retries = 3, delay = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const conn = await pool.getConnection();
      console.log("✅ MySQL connected:", process.env.DB_NAME);
      conn.release();
      return;
    } catch (err) {
      console.warn(`⚠️ MySQL connection attempt ${i}/${retries} failed:`, err.message);
      if (i < retries) {
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error("❌ MySQL connection failed permanently:", err.message);
      }
    }
  }
}
testConnection();

module.exports = pool;
