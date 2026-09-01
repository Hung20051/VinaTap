/**
 * Helper tập trung lấy danh sách các domain được phép truy cập (CORS Whitelist)
 * Dùng chung cho cả Express App và Socket.io Server
 */
function getAllowedOrigins() {
  if (process.env.ALLOWED_ORIGINS) {
    return process.env.ALLOWED_ORIGINS.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL,
  ].filter(Boolean);
}

module.exports = {
  getAllowedOrigins,
};
