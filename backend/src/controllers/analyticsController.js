const PageView = require("../models/PageView");

// ─── TRACK PAGEVIEW (PUBLIC API) ──────────────────────────────
// POST /api/analytics/track
const trackPageView = async (req, res) => {
  try {
    const { page_path, province_slug } = req.body;
    if (!page_path) {
      return res.status(400).json({ message: "Thiếu page_path" });
    }

    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "";

    const result = await PageView.track({
      pagePath: page_path,
      provinceSlug: province_slug,
      ipAddress,
      userAgent,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("trackPageView error:", err);
    res.status(500).json({ message: "Lỗi ghi nhận lượt xem" });
  }
};

// ─── GET ANALYTICS STATS (ADMIN API) ──────────────────────────
// GET /api/analytics/stats?timeframe=today|7days|30days|all
const getAnalyticsStats = async (req, res) => {
  try {
    const timeframe = req.query.timeframe || "7days";
    const stats = await PageView.getAnalyticsStats(timeframe);
    res.json({ stats });
  } catch (err) {
    console.error("getAnalyticsStats error:", err);
    res.status(500).json({ message: "Lỗi lấy thống kê truy cập" });
  }
};

module.exports = {
  trackPageView,
  getAnalyticsStats,
};
