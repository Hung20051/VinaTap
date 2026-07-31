const AdminStats = require("../models/AdminStats");

// GET /api/admin-stats/overview
const getOverview = async (req, res) => {
  try {
    const overview = await AdminStats.getOverview();
    res.json({ overview });
  } catch (err) {
    console.error("getOverview:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { getOverview };
