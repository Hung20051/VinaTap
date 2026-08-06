const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
} = require("../controllers/systemSettingController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

// Public hoặc Guest xem được thông tin liên hệ / giá vận chuyển
router.get("/", getSettings);

// Chỉ Admin mới có quyền cập nhật cấu hình hệ thống
router.put("/", protect, requireRole("admin"), updateSettings);

module.exports = router;
