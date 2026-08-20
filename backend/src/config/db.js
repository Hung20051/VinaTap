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

// Test kết nối khi khởi động
pool
  .getConnection()
  .then((conn) => {
    console.log("✅ MySQL connected:", process.env.DB_NAME);
    conn.release();
  })
  .catch((err) => {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  });

module.exports = pool;
