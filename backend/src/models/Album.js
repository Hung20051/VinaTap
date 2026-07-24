const db = require("../config/db");

const Album = {
  // Tìm album theo nfc_card_id
  // Schema v2.0: albums không còn cột province_id -> lấy tỉnh qua nfc_cards
  async findByNfcCard(nfc_card_id) {
    const [rows] = await db.execute(
      `SELECT a.*, nc.province_id, p.name AS province_name, p.slug AS province_slug,
              p.thumbnail_url AS province_thumbnail,
              u.name AS owner_name,
              s.image_url AS theme_sticker_url
       FROM albums a
       JOIN nfc_cards nc ON nc.id = a.nfc_card_id
       JOIN provinces p  ON p.id  = nc.province_id
       JOIN users u      ON u.id  = a.owner_id
       LEFT JOIN stickers s ON s.id = a.theme_sticker_id
       WHERE a.nfc_card_id = ? AND a.status = 'active' LIMIT 1`,
      [nfc_card_id],
    );
    return rows[0] || null;
  },

  // Tìm album theo id
  // Schema v2.0: albums không còn cột province_id -> lấy tỉnh qua nfc_cards
  async findById(id) {
    const [rows] = await db.execute(
      `SELECT a.*, nc.province_id, p.name AS province_name, p.slug AS province_slug,
              p.thumbnail_url AS province_thumbnail,
              u.name AS owner_name,
              s.image_url AS theme_sticker_url
       FROM albums a
       JOIN nfc_cards nc ON nc.id = a.nfc_card_id
       JOIN provinces p  ON p.id  = nc.province_id
       JOIN users u      ON u.id  = a.owner_id
       LEFT JOIN stickers s ON s.id = a.theme_sticker_id
       WHERE a.id = ? AND a.status = 'active' LIMIT 1`,
      [id],
    );
    return rows[0] || null;
  },

  // Lấy tất cả album của 1 user
  // Schema v2.0: albums không còn cột province_id -> lấy tỉnh qua nfc_cards
  async findByOwner(owner_id) {
    const [rows] = await db.execute(
      `SELECT a.*, p.name AS province_name, p.thumbnail_url AS province_thumbnail,
              (SELECT COUNT(*) FROM album_media m WHERE m.album_id = a.id AND m.status = 'active') AS media_count
       FROM albums a
       JOIN nfc_cards nc ON nc.id = a.nfc_card_id
       JOIN provinces p  ON p.id  = nc.province_id
       WHERE a.owner_id = ? AND a.status = 'active'
       ORDER BY a.updated_at DESC`,
      [owner_id],
    );
    return rows;
  },

  // Tạo album mới
  // is_public mặc định = 1: ai chạm thẻ NFC vào cũng xem được album ngay,
  // không cần đăng nhập. Chủ album có thể tự chuyển sang riêng tư sau (update()).
  // Schema v2.0: albums không còn cột province_id (lấy tỉnh qua nfc_card_id
  // để tránh 2 nguồn dữ liệu lệch nhau) -> không insert cột này nữa.
  async create({ nfc_card_id, owner_id, title }) {
    const [result] = await db.execute(
      `INSERT INTO albums (nfc_card_id, owner_id, title, is_public, status)
       VALUES (?, ?, ?, 1, 'active')`,
      [nfc_card_id, owner_id, title || null],
    );
    return result.insertId;
  },

  // Kiểm tra user có quyền SỬA album không (chủ album hoặc cộng tác viên
  // đã được duyệt quyền 'edit'). Dùng chung cho mọi thao tác ghi:
  // tag, sticker, media... để tránh lặp lại logic phân quyền ở nhiều nơi.
  async canEdit(albumId, userId) {
    const [rows] = await db.execute(
      `SELECT a.id
       FROM albums a
       LEFT JOIN album_shares s
         ON s.album_id = a.id AND s.user_id = ? AND s.status = 'approved' AND s.permission = 'edit'
       WHERE a.id = ? AND a.status = 'active' AND (a.owner_id = ? OR s.id IS NOT NULL)
       LIMIT 1`,
      [userId, albumId, userId],
    );
    return rows.length > 0;
  },

  // Cập nhật album
  async update(
    id,
    { title, description, is_public, theme_sticker_id, cover_photo_id },
  ) {
    const fields = {
      title,
      description,
      is_public,
      theme_sticker_id,
      cover_photo_id,
    };
    const keys = Object.keys(fields).filter((k) => fields[k] !== undefined);
    if (!keys.length) return;
    const setClause = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => fields[k]);
    await db.execute(`UPDATE albums SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ]);
  },

  // Tăng view_count
  async incrementView(id) {
    await db.execute(
      `UPDATE albums SET view_count = view_count + 1 WHERE id = ?`,
      [id],
    );
  },

  // Xóa mềm
  async delete(id) {
    await db.execute(`UPDATE albums SET status = 'deleted' WHERE id = ?`, [id]);
  },
};

module.exports = Album;
