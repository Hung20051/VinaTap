const express = require("express");
const router = express.Router();
const {
  trackPageView,
  trackAffiliateClick,
  getAnalyticsStats,
  getAffiliateStats,
  getPageViewCount,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const { analyticsLimiter } = require("../middleware/rateLimit");

// 1. Ghi nhận lượt xem công khai (khách xem trang)
router.post("/track", analyticsLimiter, trackPageView);

// 2. Lấy số lượt xem của 1 trang cụ thể (công khai cho giao diện hiển thị)
router.get("/page-views", getPageViewCount);

// 3. Ghi nhận click link Affiliate đối tác
router.post("/affiliate-click", analyticsLimiter, trackAffiliateClick);

// 4. Admin lấy thống kê lượt truy cập toàn diện
router.get("/stats", protect, requireRole("admin"), getAnalyticsStats);

// 5. Admin lấy thống kê lượt click Affiliate đối tác
router.get("/affiliate-stats", protect, requireRole("admin"), getAffiliateStats);

// 6. Endpoint đồng bộ dữ liệu mẫu 360+ lượt xem (hỗ trợ Vercel / Render / Production)
const { applyPresetViews } = require("../utils/seedPresetViews");
router.all("/sync-preset", async (req, res) => {
  try {
    const force = req.query.force === "true" || req.body?.force === true;
    const result = await applyPresetViews(force);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error("sync-preset error:", err);
    res.status(500).json({ message: "Lỗi đồng bộ dữ liệu mẫu", error: err.message });
  }
});

module.exports = router;

