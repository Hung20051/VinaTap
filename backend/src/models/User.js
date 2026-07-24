const db = require("../config/db");

const User = {
  // Tìm user theo email
  async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ? AND status = "active" LIMIT 1',
      [email],
    );
    return rows[0] || null;
  },

  // Tìm user theo id
  // Trả thêm phone, address, avatar_url — không trả password_hash/google_id
  // vì hàm này dùng để trả dữ liệu ra ngoài (API).
  async findById(id) {
    const [rows] = await db.execute(
      `SELECT id, name, email, phone, address, avatar_url, role, status, created_at
       FROM users WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] || null;
  },

  // Tìm user theo google_id
  async findByGoogleId(googleId) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE google_id = ? AND status = "active" LIMIT 1',
      [googleId],
    );
    return rows[0] || null;
  },

  // Tạo user mới (email/pass)
  async create({ name, email, password_hash }) {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, "customer", "active")',
      [name, email, password_hash],
    );
    return result.insertId;
  },

  // Tạo user mới (Google OAuth)
  async createWithGoogle({ name, email, google_id }) {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, google_id, role, status) VALUES (?, ?, ?, "customer", "active")',
      [name, email, google_id],
    );
    return result.insertId;
  },

  // Cập nhật google_id cho user đã có email
  async updateGoogleId(id, google_id) {
    await db.execute("UPDATE users SET google_id = ? WHERE id = ?", [
      google_id,
      id,
    ]);
  },

  // Cập nhật hồ sơ (tên, SĐT, địa chỉ, ảnh đại diện) — dùng cho
  // PATCH /api/auth/me và POST /api/auth/me/avatar. Chỉ update các
  // trường được truyền vào (khác undefined) để cho phép client gửi
  // thiếu field mà không bị ghi đè thành NULL ngoài ý muốn.
  async updateProfile(id, { name, phone, address, avatar_url }) {
    const fields = { name, phone, address, avatar_url };
    const keys = Object.keys(fields).filter((k) => fields[k] !== undefined);
    if (!keys.length) return;
    const setClause = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => fields[k]);
    await db.execute(`UPDATE users SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ]);
  },

  // Gán/đổi mật khẩu cho user đã tồn tại — dùng khi:
  //  - Link mật khẩu vào tài khoản trước đây chỉ đăng nhập bằng Google
  //  - Đặt lại mật khẩu qua luồng quên mật khẩu (OTP)
  async setPassword(id, password_hash) {
    await db.execute("UPDATE users SET password_hash = ? WHERE id = ?", [
      password_hash,
      id,
    ]);
  },
};

module.exports = User;
