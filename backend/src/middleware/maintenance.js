const SystemSetting = require("../models/SystemSetting");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const checkMaintenance = async (req, res, next) => {
  try {
    // Các route bỏ qua kiểm tra bảo trì:
    // - Login (cần đăng nhập để biết là admin)
    // - GET /auth/me (kiểm tra session, KHÔNG cho PATCH sửa profile khi bảo trì)
    // - Google OAuth callback
    // - Health check, System settings, Analytics
    const path = req.path;
    if (
      path.startsWith("/auth/login") ||
      (path.startsWith("/auth/me") && req.method === "GET") ||
      path.startsWith("/auth/google") ||
      path.startsWith("/health") ||
      path.startsWith("/system-settings") ||
      path.startsWith("/analytics")
    ) {
      return next();
    }

    const settings = await SystemSetting.getAll();
    if (settings.maintenance_mode === "true") {
      // 1. Nếu req.user đã có từ middleware trước đó
      if (req.user && req.user.role === "admin") {
        return next();
      }

      // 2. Tự động kiểm tra JWT từ Authorization Header nếu có
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded && decoded.id) {
            const [rows] = await db.execute(
              `SELECT id, role, status FROM users WHERE id = ? LIMIT 1`,
              [decoded.id],
            );
            const freshUser = rows[0];
            if (freshUser && freshUser.status === "active" && freshUser.role === "admin") {
              req.user = { id: freshUser.id, role: freshUser.role };
              return next(); // Cho phép Admin truy cập hệ thống ngay cả khi đang bảo trì
            }
          }
        } catch (jwtErr) {
          // Token không hợp lệ hoặc hết hạn → tiếp tục chặn bảo trì
        }
      }

      return res.status(503).json({
        message:
          "Hệ thống VinaTap hiện đang bảo trì để nâng cấp dịch vụ. Vui lòng quay lại sau ít phút!",
        maintenance: true,
      });
    }

    next();
  } catch (err) {
    next();
  }
};

module.exports = checkMaintenance;

