const db = require("../config/db");

const Album = {
  // Tìm album theo nfc_card_id
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
  async create({ nfc_card_id, owner_id, title }) {
    const [result] = await db.execute(
      `INSERT INTO albums (nfc_card_id, owner_id, title, is_public, status)
       VALUES (?, ?, ?, 1, 'active')`,
      [nfc_card_id, owner_id, title || null],
    );
    return result.insertId;
  },

  // Kiểm tra user có quyền SỬA album không
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

  // ─── ADMIN FUNCTIONS (PRIVACY-FIRST METADATA) ────────────────

  // Thống kê tài nguyên & số lượng album cho Admin
  async getAdminStats() {
    let totalAlbumsCount = 0;
    let privateAlbumsCount = 0;
    let publicAlbumsCount = 0;
    let photosCount = 0;
    let videosCount = 0;

    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM albums WHERE status != 'deleted'`,
      );
      totalAlbumsCount = res[0]?.count || 0;
    } catch (e) {}

    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM albums WHERE is_public = 0 AND status != 'deleted'`,
      );
      privateAlbumsCount = res[0]?.count || 0;
    } catch (e) {}

    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM albums WHERE is_public = 1 AND status != 'deleted'`,
      );
      publicAlbumsCount = res[0]?.count || 0;
    } catch (e) {}

    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM album_media WHERE media_type = 'photo' AND status = 'active'`,
      );
      photosCount = res[0]?.count || 0;
    } catch (e) {}

    try {
      const [res] = await db.execute(
        `SELECT COUNT(*) AS count FROM album_media WHERE media_type = 'video' AND status = 'active'`,
      );
      videosCount = res[0]?.count || 0;
    } catch (e) {}

    // Kích thước ước tính: photo ~ 2MB, video ~ 15MB
    const estimatedBytes = photosCount * 2097152 + videosCount * 15728640;

    return {
      total_albums: Number(totalAlbumsCount),
      private_albums: Number(privateAlbumsCount),
      public_albums: Number(publicAlbumsCount),
      total_photos: Number(photosCount),
      total_videos: Number(videosCount),
      estimated_bytes: Number(estimatedBytes),
    };
  },

  // Lấy danh sách album cho Admin (chỉ lấy Metadata, không lấy file_url riêng tư)
  async getAdminList({ search, status, privacy, page = 1, limit = 20 }) {
    let whereClauses = [];
    let params = [];

    if (status && status !== "all") {
      whereClauses.push("a.status = ?");
      params.push(status);
    } else {
      whereClauses.push("a.status != 'deleted'");
    }

    if (privacy === "private") {
      whereClauses.push("a.is_public = 0");
    } else if (privacy === "public") {
      whereClauses.push("a.is_public = 1");
    }

    if (search) {
      whereClauses.push(
        "(a.title LIKE ? OR u.name LIKE ? OR p.name LIKE ? OR nc.serial_code LIKE ?)",
      );
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    const whereSql = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";
    const limitNum = Number(limit) || 20;
    const offsetNum = (Number(page) - 1) * limitNum;

    const [rows] = await db.execute(
      `SELECT a.id, a.title, a.description, a.is_public, a.view_count, a.status, a.created_at, a.updated_at,
              u.id AS owner_id, u.name AS owner_name, u.email AS owner_email,
              p.id AS province_id, p.name AS province_name, p.slug AS province_slug,
              nc.serial_code,
              (SELECT COUNT(*) FROM album_media m WHERE m.album_id = a.id AND m.status = 'active' AND m.media_type = 'photo') AS photo_count,
              (SELECT COUNT(*) FROM album_media m WHERE m.album_id = a.id AND m.status = 'active' AND m.media_type = 'video') AS video_count
       FROM albums a
       JOIN nfc_cards nc ON nc.id = a.nfc_card_id
       JOIN provinces p  ON p.id  = nc.province_id
       JOIN users u      ON u.id  = a.owner_id
       ${whereSql}
       ORDER BY a.created_at DESC
       LIMIT ${limitNum} OFFSET ${offsetNum}`,
      params,
    );

    const [countRows] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM albums a
       JOIN nfc_cards nc ON nc.id = a.nfc_card_id
       JOIN provinces p  ON p.id  = nc.province_id
       JOIN users u      ON u.id  = a.owner_id
       ${whereSql}`,
      params,
    );

    return {
      albums: rows || [],
      total: Number(countRows[0]?.count || 0),
      page: Number(page),
      limit: limitNum,
    };
  },

  // Cập nhật trạng thái Admin (Toggle is_public hoặc status)
  async updateAdminStatus(id, { is_public, status }) {
    const updates = [];
    const params = [];
    if (is_public !== undefined) {
      updates.push("is_public = ?");
      params.push(is_public ? 1 : 0);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      params.push(status);
    }
    if (!updates.length) return;
    params.push(id);
    await db.execute(
      `UPDATE albums SET ${updates.join(", ")} WHERE id = ?`,
      params,
    );
  },
};

module.exports = Album;
