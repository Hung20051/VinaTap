const db = require("../config/db");

const NfcCard = {
  // Tìm theo serial_code (dự phòng chip hỏng)
  async findBySerial(serial_code) {
    const [rows] = await db.execute(
      `SELECT n.*, p.name AS province_name, p.slug AS province_slug, p.thumbnail_url
       FROM nfc_cards n
       JOIN provinces p ON p.id = n.province_id
       WHERE n.serial_code = ? LIMIT 1`,
      [serial_code],
    );
    return rows[0] || null;
  },

  // Tìm theo nfc_token (URL chip NFC)
  async findByToken(nfc_token) {
    const [rows] = await db.execute(
      `SELECT n.*, p.name AS province_name, p.slug AS province_slug, p.thumbnail_url
       FROM nfc_cards n
       JOIN provinces p ON p.id = n.province_id
       WHERE n.nfc_token = ? LIMIT 1`,
      [nfc_token],
    );
    return rows[0] || null;
  },

  // Tất cả thẻ của 1 user — kèm album_id, share_code, album_status nếu có
  async findByOwner(user_id) {
    const [rows] = await db.execute(
      `SELECT n.id, n.serial_code, n.nfc_token, n.status, n.activated_at,
              n.province_id,
              p.name AS province_name, p.slug AS province_slug, p.thumbnail_url, p.region,
              a.id AS album_id,
              a.share_code,
              a.status AS album_status,
              a.locked_reason
       FROM nfc_cards n
       JOIN provinces p ON p.id = n.province_id
       LEFT JOIN albums a ON a.nfc_card_id = n.id AND a.status != 'deleted'
       WHERE n.owner_user_id = ? AND n.status = 'active'
       ORDER BY n.activated_at DESC`,
      [user_id],
    );
    return rows;
  },

  // Kích hoạt bằng serial (dự phòng) — thẻ gỗ không hết hạn nên bỏ expires_at
  async activate(serial_code, user_id) {
    const [result] = await db.execute(
      `UPDATE nfc_cards
       SET owner_user_id = ?, activated_at = NOW(), status = 'active'
       WHERE serial_code = ? AND owner_user_id IS NULL AND status != 'disabled'`,
      [user_id, serial_code],
    );
    return result.affectedRows > 0;
  },

  // Admin: tạo 1 thẻ đơn lẻ
  async create({ serial_code, nfc_token, province_id }) {
    const [result] = await db.execute(
      `INSERT INTO nfc_cards (serial_code, nfc_token, province_id, status)
       VALUES (?, ?, ?, 'pending')`,
      [serial_code, nfc_token, province_id],
    );
    return result.insertId;
  },

  // Admin: tạo nhiều thẻ cùng lúc
  async createBatch(serials) {
    // serials: [{ serial_code, nfc_token, province_id }]
    const values = serials.map((s) => [
      s.serial_code,
      s.nfc_token,
      s.province_id,
      "pending",
    ]);
    await db.query(
      `INSERT INTO nfc_cards (serial_code, nfc_token, province_id, status) VALUES ?`,
      [values],
    );
  },
};

module.exports = NfcCard;
