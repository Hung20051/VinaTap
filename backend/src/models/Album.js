const crypto = require("crypto");
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
       WHERE a.nfc_card_id = ? AND a.status != 'deleted' LIMIT 1`,
      [nfc_card_id],
    );
    return rows[0] || null;
  },

  // Tìm album theo id hoặc share_code
  async findById(identifier) {
    const isNumeric = /^\d+$/.test(String(identifier));
    const query = isNumeric
      ? `SELECT a.*, nc.province_id, p.name AS province_name, p.slug AS province_slug,
                p.thumbnail_url AS province_thumbnail,
                u.name AS owner_name,
                s.image_url AS theme_sticker_url
         FROM albums a
         JOIN nfc_cards nc ON nc.id = a.nfc_card_id
         JOIN provinces p  ON p.id  = nc.province_id
         JOIN users u      ON u.id  = a.owner_id
         LEFT JOIN stickers s ON s.id = a.theme_sticker_id
         WHERE a.id = ? AND a.status != 'deleted' LIMIT 1`
      : `SELECT a.*, nc.province_id, p.name AS province_name, p.slug AS province_slug,
                p.thumbnail_url AS province_thumbnail,
                u.name AS owner_name,
                s.image_url AS theme_sticker_url
         FROM albums a
         JOIN nfc_cards nc ON nc.id = a.nfc_card_id
         JOIN provinces p  ON p.id  = nc.province_id
         JOIN users u      ON u.id  = a.owner_id
         LEFT JOIN stickers s ON s.id = a.theme_sticker_id
         WHERE a.share_code = ? AND a.status != 'deleted' LIMIT 1`;

    const [rows] = await db.execute(query, [identifier]);
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
       WHERE a.owner_id = ? AND a.status != 'deleted'
       ORDER BY a.updated_at DESC`,
      [owner_id],
    );
    return rows;
  },

  // Tạo album mới kèm share_code bảo mật (hoặc kích hoạt lại nếu đã từng tạo)
  async create({ nfc_card_id, owner_id, title }) {
    const [existing] = await db.execute(
      `SELECT id, share_code FROM albums WHERE nfc_card_id = ? LIMIT 1`,
      [nfc_card_id],
    );

    if (existing.length > 0) {
      const album = existing[0];
      await db.execute(
        `UPDATE albums SET status = 'active', owner_id = ?, title = COALESCE(?, title), is_public = 1 WHERE id = ?`,
        [owner_id, title || null, album.id],
      );
      return { id: album.id, share_code: album.share_code };
    }

    const share_code = "vnt-" + crypto.randomBytes(5).toString("hex");
    const [result] = await db.execute(
      `INSERT INTO albums (nfc_card_id, share_code, owner_id, title, is_public, status)
       VALUES (?, ?, ?, ?, 1, 'active')`,
      [nfc_card_id, share_code, owner_id, title || null],
    );
    return { id: result.insertId, share_code };
  },

  // Kiểm tra user có quyền SỬA album không
  async canEdit(albumId, userId) {
    const isNumeric = /^\d+$/.test(String(albumId));
    const query = isNumeric
      ? `SELECT a.id FROM albums a
         LEFT JOIN album_shares s
           ON s.album_id = a.id AND s.user_id = ? AND s.status = 'approved' AND s.permission = 'edit'
         WHERE a.id = ? AND a.status = 'active' AND (a.owner_id = ? OR s.id IS NOT NULL)
         LIMIT 1`
      : `SELECT a.id FROM albums a
         LEFT JOIN album_shares s
           ON s.album_id = a.id AND s.user_id = ? AND s.status = 'approved' AND s.permission = 'edit'
         WHERE a.share_code = ? AND a.status = 'active' AND (a.owner_id = ? OR s.id IS NOT NULL)
         LIMIT 1`;
    const [rows] = await db.execute(query, [userId, albumId, userId]);
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
    const isNumeric = /^\d+$/.test(String(id));
    const whereClause = isNumeric ? `WHERE id = ?` : `WHERE share_code = ?`;
    await db.execute(
      `UPDATE albums SET ${setClause} ${whereClause}`,
      [...values, id],
    );
  },

  // Tăng view_count
  async incrementView(id) {
    const isNumeric = /^\d+$/.test(String(id));
    const whereClause = isNumeric ? `WHERE id = ?` : `WHERE share_code = ?`;
    await db.execute(
      `UPDATE albums SET view_count = view_count + 1 ${whereClause}`,
      [id],
    );
  },

  // Xóa mềm
  async delete(id) {
    const isNumeric = /^\d+$/.test(String(id));
    const whereClause = isNumeric ? `WHERE id = ?` : `WHERE share_code = ?`;
    await db.execute(
      `UPDATE albums SET status = 'deleted' ${whereClause}`,
      [id],
    );
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
      `SELECT a.id, a.share_code, a.title, a.description, a.is_public, a.view_count, a.status, a.locked_reason, a.created_at, a.updated_at,
              u.id AS owner_id, u.name AS owner_name, u.email AS owner_email,
              p.id AS province_id, p.name AS province_name, p.slug AS province_slug,
              nc.serial_code,
              (SELECT COUNT(*) FROM album_media m WHERE m.album_id = a.id AND m.status = 'active' AND m.media_type = 'photo') AS photo_count,
              (SELECT COUNT(*) FROM album_media m WHERE m.album_id = a.id AND m.status = 'active' AND m.media_type = 'video') AS video_count,
              (SELECT COUNT(*) FROM album_reports r WHERE r.album_id = a.id AND r.status = 'pending') AS report_count
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

  // Lấy danh sách báo cáo vi phạm cho Admin
  async getAdminReports({ status = "pending", page = 1, limit = 20 }) {
    let whereClause = "r.status = ?";
    let params = [status];
    if (status === "all") {
      whereClause = "1=1";
      params = [];
    }

    const limitNum = Number(limit) || 20;
    const offsetNum = (Number(page) - 1) * limitNum;

    const [rows] = await db.execute(
      `SELECT r.id AS report_id, r.album_id, r.reason, r.description, r.status AS report_status, r.created_at AS report_created_at,
              r.reporter_email,
              u_rep.name AS reporter_name,
              a.share_code, a.title AS album_title, a.is_public, a.status AS album_status, a.locked_reason,
              u_owner.id AS owner_id, u_owner.name AS owner_name, u_owner.email AS owner_email,
              p.name AS province_name,
              nc.serial_code,
              (SELECT COUNT(*) FROM album_media m WHERE m.album_id = a.id AND m.status = 'active') AS media_count
       FROM album_reports r
       JOIN albums a ON a.id = r.album_id
       JOIN nfc_cards nc ON nc.id = a.nfc_card_id
       JOIN provinces p ON p.id = nc.province_id
       JOIN users u_owner ON u_owner.id = a.owner_id
       LEFT JOIN users u_rep ON u_rep.id = r.reporter_user_id
       WHERE ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT ${limitNum} OFFSET ${offsetNum}`,
      params,
    );

    const [countRows] = await db.execute(
      `SELECT COUNT(*) AS count FROM album_reports r WHERE ${whereClause}`,
      params,
    );

    return {
      reports: rows || [],
      total: Number(countRows[0]?.count || 0),
      page: Number(page),
      limit: limitNum,
    };
  },

  // Cập nhật trạng thái Admin (Toggle is_public hoặc status kèm locked_reason)
  async updateAdminStatus(id, { is_public, status, locked_reason }) {
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
    if (locked_reason !== undefined) {
      updates.push("locked_reason = ?");
      params.push(locked_reason);
    }
    if (!updates.length) return;
    const isNumeric = /^\d+$/.test(String(id));
    const whereClause = isNumeric ? `WHERE id = ?` : `WHERE share_code = ?`;
    params.push(id);
    await db.execute(
      `UPDATE albums SET ${updates.join(", ")} ${whereClause}`,
      params,
    );
  },
};

module.exports = Album;
