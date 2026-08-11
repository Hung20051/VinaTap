const express = require("express");
const router = express.Router();
const {
  trackPageView,
  getAnalyticsStats,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const { analyticsLimiter } = require("../middleware/rateLimit");

// Ghi nhận lượt xem công khai (khách xem trang)
router.post("/track", analyticsLimiter, trackPageView);

// Admin lấy thống kê lượt truy cập thực (đã lọc bot)
router.get("/stats", protect, requireRole("admin"), getAnalyticsStats);

module.exports = router;
