const db = require("../config/db");

const User = {
  // Tìm user theo email — CHỈ tài khoản active. Dùng cho ĐĂNG NHẬP (email
  // bị khóa thì coi như "không tìm thấy", không cho login).
  async findByEmail(email) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE LOWER(email) = ? AND status = 'active' LIMIT 1",
      [cleanEmail],
    );
    return rows[0] || null;
  },

  // Tìm user theo email, KHÔNG lọc status
  async findByEmailAny(email) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1",
      [cleanEmail],
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
      "SELECT * FROM users WHERE google_id = ? AND status = 'active' LIMIT 1",
      [googleId],
    );
    return rows[0] || null;
  },

  // Tạo user mới (email/pass)
  async create({ name, email, password_hash }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, 'customer', 'active')",
      [name, cleanEmail, password_hash],
    );
    return result.insertId;
  },

  // Tạo user mới (Google OAuth)
  async createWithGoogle({ name, email, google_id }) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const [result] = await db.execute(
      "INSERT INTO users (name, email, google_id, role, status) VALUES (?, ?, ?, 'customer', 'active')",
      [name, cleanEmail, google_id],
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

  // ─── QUẢN LÝ USER (admin) ───────────────────────────────────
  // Danh sách + tìm kiếm (tên/email) + đếm số thẻ NFC đã kích hoạt và số
  // album đã tạo — dùng subquery đếm riêng thay vì JOIN trực tiếp để
  // tránh nhân bản dòng (1 user có N thẻ + M album sẽ ra N*M dòng nếu
  // JOIN thẳng cả 2 bảng cùng lúc).
  // Tách logic build WHERE ra riêng — dùng chung giữa findAllForAdmin
  // (lấy danh sách) và countForAdmin (đếm tổng, để FE biết còn trang sau
  // hay không), tránh viết trùng điều kiện search/role ở 2 chỗ rồi lỡ
  // sửa 1 chỗ quên chỗ kia.
  _buildAdminWhere({ search, role }) {
    const where = [];
    const params = [];
    if (search) {
      where.push("(name LIKE ? OR email LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role && ["admin", "customer"].includes(role)) {
      where.push("role = ?");
      params.push(role);
    }
    return {
      whereClause: where.length ? `WHERE ${where.join(" AND ")}` : "",
      params,
    };
  },

  async findAllForAdmin({ search, role, limit = 50, offset = 0 } = {}) {
    const { whereClause, params } = this._buildAdminWhere({ search, role });

    // LIMIT/OFFSET: mysql2 (execute/prepared statement) có thể báo lỗi
    // ER_WRONG_ARGUMENTS với placeholder "?" ở LIMIT/OFFSET tùy phiên bản
    // — đã gặp lỗi này ở ManualSale.findAll, nên áp dụng luôn cách né ở
    // đây: ép số nguyên an toàn rồi chèn thẳng vào chuỗi SQL.
    const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 50, 500));
    const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

    const [rows] = await db.execute(
      `SELECT
         u.id, u.name, u.email, u.phone, u.avatar_url, u.role, u.status, u.created_at,
         (SELECT COUNT(*) FROM nfc_cards nc WHERE nc.owner_user_id = u.id) AS nfc_count,
         (SELECT COUNT(*) FROM albums a WHERE a.owner_id = u.id AND a.status = 'active') AS album_count
       FROM users u
       ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      params,
    );
    return rows;
  },

  // Đếm tổng số user khớp bộ lọc (KHÔNG áp LIMIT/OFFSET) — trước đây
  // AdminUsers.jsx luôn chỉ lấy 50 user đầu tiên (mặc định limit=50) mà
  // không có cách nào biết còn user nào bị ẩn phía sau hay không, cũng
  // không có nút chuyển trang -> user thứ 51 trở đi không hiện được.
  async countForAdmin({ search, role } = {}) {
    const { whereClause, params } = this._buildAdminWhere({ search, role });
    const [rows] = await db.execute(
      `SELECT COUNT(*) AS total FROM users u ${whereClause}`,
      params,
    );
    return rows[0].total;
  },

  // users.status giờ chỉ còn ENUM('active','banned') — "inactive" đã được
  // xóa hẳn khỏi schema (không phải chỉ ẩn khỏi API) vì không nơi nào
  // trong code từng gán giá trị này.
  async setStatus(id, status) {
    if (!["active", "banned"].includes(status)) {
      throw new Error("status không hợp lệ");
    }
    await db.execute("UPDATE users SET status = ? WHERE id = ?", [status, id]);
  },

  async setRole(id, role) {
    if (!["admin", "customer"].includes(role)) {
      throw new Error("role không hợp lệ");
    }
    await db.execute("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  },

  async getDetailForAdmin(id) {
    const user = await this.findById(id);
    if (!user) return null;

    const [nfcCards] = await db.execute(
      `SELECT id, serial_code, nfc_token, status, created_at FROM nfc_cards WHERE owner_user_id = ? ORDER BY created_at DESC`,
      [id],
    );

    const [albums] = await db.execute(
      `SELECT id, title, description, view_count, is_public, created_at FROM albums WHERE owner_id = ? AND status = 'active' ORDER BY created_at DESC`,
      [id],
    );

    return {
      ...user,
      nfc_cards: nfcCards,
      albums,
    };
  },
};

module.exports = User;
