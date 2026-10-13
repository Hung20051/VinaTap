const express = require("express");
const router = express.Router();
const {
  trackPageView,
  trackAffiliateClick,
  getAnalyticsStats,
  getAffiliateStats,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const { analyticsLimiter } = require("../middleware/rateLimit");

// 1. Ghi nhận lượt xem công khai (khách xem trang)
router.post("/track", analyticsLimiter, trackPageView);

// 2. Ghi nhận click link Affiliate đối tác
router.post("/affiliate-click", analyticsLimiter, trackAffiliateClick);

// 3. Admin lấy thống kê lượt truy cập toàn diện
router.get("/stats", protect, requireRole("admin"), getAnalyticsStats);

// 4. Admin lấy thống kê lượt click Affiliate đối tác
router.get("/affiliate-stats", protect, requireRole("admin"), getAffiliateStats);

module.exports = router;
