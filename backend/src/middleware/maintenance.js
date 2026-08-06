const SystemSetting = require("../models/SystemSetting");

const checkMaintenance = async (req, res, next) => {
  try {
    // Các route bỏ qua kiểm tra bảo trì: Auth login, Me, Health check, Admin settings
    const path = req.path;
    if (
      path.startsWith("/auth/login") ||
      path.startsWith("/auth/me") ||
      path.startsWith("/health") ||
      path.startsWith("/system-settings")
    ) {
      return next();
    }

    const settings = await SystemSetting.getAll();
    if (settings.maintenance_mode === "true") {
      // Nếu user đã đăng nhập và là admin thì vẫn được thao tác
      if (req.user && req.user.role === "admin") {
        return next();
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
