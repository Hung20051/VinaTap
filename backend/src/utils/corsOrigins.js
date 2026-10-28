/**
 * Helper tập trung lấy danh sách các domain được phép truy cập (CORS Whitelist)
 * Dùng chung cho cả Express App và Socket.io Server
 */
function getAllowedOrigins() {
  const defaultOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://vinatap.io.vn",
    "https://www.vinatap.io.vn",
    "https://vinatap.vercel.app",
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  if (process.env.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return Array.from(new Set([...defaultOrigins, ...envOrigins]));
  }
  return Array.from(new Set(defaultOrigins));
}

module.exports = {
  getAllowedOrigins,
};
