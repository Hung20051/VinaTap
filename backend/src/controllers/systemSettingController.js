const SystemSetting = require("../models/SystemSetting");

const PUBLIC_SETTING_KEYS = [
  "company_name",
  "company_hotline",
  "company_email",
  "company_address",
  "bank_id",
  "bank_name",
  "bank_account_no",
  "bank_account_name",
  "maintenance_mode",
  "allow_registration",
];

// GET /api/system-settings
const getSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.getAll();
    const isAdmin = req.user && req.user.role === "admin";
    if (isAdmin) {
      return res.json({ settings });
    }

    const publicSettings = {};
    PUBLIC_SETTING_KEYS.forEach((k) => {
      if (settings[k] !== undefined) {
        publicSettings[k] = settings[k];
      }
    });

    res.json({ settings: publicSettings });
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
