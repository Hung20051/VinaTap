const SystemSetting = require("../models/SystemSetting");

// GET /api/system-settings
const getSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.getAll();
    res.json({ settings });
  } catch (err) {
    console.error("getSettings error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PUT /api/system-settings
const updateSettings = async (req, res) => {
  try {
    await SystemSetting.updateMany(req.body);
    const settings = await SystemSetting.getAll();
    res.json({ message: "Cập nhật cài đặt hệ thống thành công!", settings });
  } catch (err) {
    console.error("updateSettings error:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật cài đặt" });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
