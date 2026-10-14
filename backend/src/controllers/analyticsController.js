const PageView = require("../models/PageView");
const AffiliateClick = require("../models/AffiliateClick");

// ─── TRACK PAGEVIEW (PUBLIC API) ──────────────────────────────
// POST /api/analytics/track
const trackPageView = async (req, res) => {
  try {
    const {
      page_path,
      province_slug,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      session_id,
      duration_seconds,
    } = req.body;

    if (!page_path || typeof page_path !== "string") {
      return res.status(400).json({ message: "Thiếu hoặc sai định dạng page_path" });
    }

    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "";

    const result = await PageView.track({
      pagePath: page_path,
      provinceSlug: province_slug,
      ipAddress,
      userAgent,
      referrer: referrer || req.headers["referer"] || null,
      utmSource: utm_source,
      utmMedium: utm_medium,
      utmCampaign: utm_campaign,
      sessionId: session_id,
      durationSeconds: Number(duration_seconds) || 0,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("trackPageView error:", err);
    res.status(500).json({ message: "Lỗi ghi nhận lượt xem" });
  }
};

// ─── TRACK AFFILIATE CLICK (PUBLIC API) ────────────────────────
// POST /api/analytics/affiliate-click
const trackAffiliateClick = async (req, res) => {
  try {
    const { page_path, partner_name, destination_url, link_title } = req.body;

    if (!page_path || !destination_url) {
      return res.status(400).json({ message: "Thiếu page_path hoặc destination_url" });
    }

    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "";

    const result = await AffiliateClick.trackClick({
      pagePath: page_path,
      partnerName: partner_name || "other",
      destinationUrl: destination_url,
      linkTitle: link_title || "",
      ipAddress,
      userAgent,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("trackAffiliateClick error:", err);
    res.status(500).json({ message: "Lỗi ghi nhận click affiliate" });
  }
};

// ─── GET ANALYTICS STATS (ADMIN API) ──────────────────────────
// GET /api/analytics/stats?timeframe=today|7days|30days|all
const getAnalyticsStats = async (req, res) => {
  try {
    const validTimeframes = ["today", "7days", "30days", "all"];
    const timeframe = validTimeframes.includes(req.query.timeframe)
      ? req.query.timeframe
      : "7days";

    const stats = await PageView.getAnalyticsStats(timeframe);
    res.json({ stats });
  } catch (err) {
    console.error("getAnalyticsStats error:", err);
    res.status(500).json({ message: "Lỗi lấy thống kê truy cập" });
  }
};

// ─── GET AFFILIATE STATS (ADMIN API) ──────────────────────────
// GET /api/analytics/affiliate-stats?timeframe=today|7days|30days|all
const getAffiliateStats = async (req, res) => {
  try {
    const validTimeframes = ["today", "7days", "30days", "all"];
    const timeframe = validTimeframes.includes(req.query.timeframe)
      ? req.query.timeframe
      : "7days";

    const stats = await AffiliateClick.getAffiliateStats(timeframe);
    res.json({ stats });
  } catch (err) {
    console.error("getAffiliateStats error:", err);
    res.status(500).json({ message: "Lỗi lấy thống kê affiliate" });
  }
};

// ─── GET PAGEVIEW COUNT FOR SPECIFIC PAGE (PUBLIC API) ─────────
// GET /api/analytics/page-views?path=/stay/casa-blanca-da-lat
const getPageViewCount = async (req, res) => {
  try {
    const pagePath = req.query.path || req.query.page_path;
    if (!pagePath) {
      return res.status(400).json({ message: "Thiếu tham số path" });
    }
    const result = await PageView.getPageViews(pagePath);
    res.json(result);
  } catch (err) {
    console.error("getPageViewCount error:", err);
    res.status(500).json({ message: "Lỗi lấy số lượt xem" });
  }
};

module.exports = {
  trackPageView,
  trackAffiliateClick,
  getAnalyticsStats,
  getAffiliateStats,
  getPageViewCount,
};

