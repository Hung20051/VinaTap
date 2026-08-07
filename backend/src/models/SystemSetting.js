const db = require("../config/db");

class SystemSetting {
  static async getAll() {
    try {
      const [rows] = await db.execute(
        `SELECT setting_key, setting_value FROM system_settings`,
      );
      const settings = {};
      rows.forEach((r) => {
        settings[r.setting_key] = r.setting_value;
      });
      return settings;
    } catch (err) {
      // Nếu chưa có bảng thì trả về cấu hình mặc định
      return {
        company_name: "VinaTap - Bản Đồ Du Lịch NFC Việt Nam",
        company_hotline: "1900 888 999",
        company_email: "support@vinatap.vn",
        company_address: "Số 108 Phố Huế, Quận Hai Bà Trưng, Hà Nội",
        default_nfc_price: "150000",
        combo_34_price: "4500000",
        shipping_fee: "30000",
        free_shipping_min: "500000",
        bank_id: "MBBANK",
        bank_name: "MBBank (NH Quân Đội)",
        bank_account_no: "0813607311",
        bank_account_name: "VINATAP VIETNAM CO LTD",
        ai_caption_prompt:
          "Bạn là trợ lý du lịch Việt Nam. Hãy viết 1 caption ngắn gọn, cảm xúc bằng tiếng Việt (tối đa 2 câu) mô tả bức ảnh du lịch này. Chỉ trả về caption, không thêm gì khác.",
        maintenance_mode: "false",
        allow_registration: "true",
      };
    }
  }

  static async updateMany(settingsObj) {
    // Đảm bảo bảng tồn tại
    await db.execute(`
      CREATE TABLE IF NOT EXISTS system_settings (
        setting_key   VARCHAR(100) NOT NULL PRIMARY KEY,
        setting_value TEXT         NOT NULL,
        updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    for (const [key, value] of Object.entries(settingsObj)) {
      await db.execute(
        `INSERT INTO system_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [key, String(value), String(value)],
      );
    }
    return true;
  }
}

module.exports = SystemSetting;
