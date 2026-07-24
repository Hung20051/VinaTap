const db = require("../config/db");

const OtpCode = {
  // Xoá các mã OTP cũ (chưa dùng) của cùng email + purpose trước khi tạo
  // mã mới — tránh việc 1 email có nhiều mã cùng hợp lệ song song.
  async invalidateByEmailPurpose(email, purpose) {
    await db.execute("DELETE FROM otp_codes WHERE email = ? AND purpose = ?", [
      email,
      purpose,
    ]);
  },

  async create({ email, purpose, otp_hash, payload, expires_at }) {
    const [result] = await db.execute(
      `INSERT INTO otp_codes (email, purpose, otp_hash, payload, expires_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        email,
        purpose,
        otp_hash,
        payload ? JSON.stringify(payload) : null,
        expires_at,
      ],
    );
    return result.insertId;
  },

  // Lấy mã OTP mới nhất còn hiệu lực (chưa consume) cho email + purpose
  async findLatestPending(email, purpose) {
    const [rows] = await db.execute(
      `SELECT * FROM otp_codes
       WHERE email = ? AND purpose = ? AND consumed_at IS NULL
       ORDER BY id DESC LIMIT 1`,
      [email, purpose],
    );
    return rows[0] || null;
  },

  async incrementAttempts(id) {
    await db.execute(
      "UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?",
      [id],
    );
  },

  async markConsumed(id) {
    await db.execute("UPDATE otp_codes SET consumed_at = NOW() WHERE id = ?", [
      id,
    ]);
  },
};

module.exports = OtpCode;
