const Album = require("../models/Album");
const NfcCard = require("../models/NfcCard");
const db = require("../config/db");

// ─── TẠO ALBUM SAU KHI KÍCH HOẠT NFC ────────────────────────
// POST /api/albums
// Body: { nfc_card_id }
const createAlbum = async (req, res) => {
  try {
    const { nfc_card_id } = req.body;
    if (!nfc_card_id)
      return res.status(400).json({ message: "Thiếu nfc_card_id" });

    // Kiểm tra thẻ thuộc về user này
    const [cards] = await db.execute(
      `SELECT * FROM nfc_cards WHERE id = ? AND owner_user_id = ? AND status = 'active'`,
      [nfc_card_id, req.user.id],
    );
    if (!cards.length)
      return res
        .status(403)
        .json({ message: "Thẻ NFC không hợp lệ hoặc không thuộc về bạn" });

    const card = cards[0];

    // Kiểm tra album đã tồn tại chưa (1 NFC = 1 album)
    const existing = await Album.findByNfcCard(nfc_card_id);
    if (existing)
      return res
        .status(409)
        .json({ message: "Album đã tồn tại cho thẻ này", album: existing });

    const id = await Album.create({
      nfc_card_id,
      owner_id: req.user.id,
      title: req.body.title,
    });
    const album = await Album.findById(id);

    res.status(201).json({ message: "Tạo album thành công", album });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      const existing = await Album.findByNfcCard(req.body.nfc_card_id);
      return res
        .status(409)
        .json({ message: "Album đã tồn tại cho thẻ này", album: existing });
    }
    console.error("createAlbum:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── XEM ALBUM (guest xem nếu public) ────────────────────────
// GET /api/albums/:id
const getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album)
      return res.status(404).json({ message: "Không tìm thấy album" });

    // Nếu album private thì chỉ owner hoặc cộng tác viên mới xem được
    if (!album.is_public) {
      if (!req.user)
        return res.status(403).json({ message: "Album này ở chế độ riêng tư" });

      const isOwner = album.owner_id === req.user.id;
      if (!isOwner) {
        const [shares] = await db.execute(
          `SELECT * FROM album_shares
           WHERE album_id = ? AND user_id = ? AND status = 'approved'`,
          [album.id, req.user.id],
        );
        if (!shares.length)
          return res
            .status(403)
            .json({ message: "Bạn không có quyền xem album này" });
      }
    }

    // Lấy media trong album
    // "stickers": trước đây addStickerOverlay/update/delete tồn tại nhưng
    // không có nơi nào trả overlay về cho client -> ảnh dán sticker xong
    // reload trang là mất dấu vết. Dùng subquery JSON_ARRAYAGG lấy toàn bộ
    // overlay + ảnh sticker theo từng media (NULL nếu ảnh chưa dán gì).
    const [media] = await db.execute(
      `SELECT m.*,
              GROUP_CONCAT(DISTINCT t.label ORDER BY t.label SEPARATOR ',') AS tags,
              (SELECT JSON_ARRAYAGG(JSON_OBJECT(
                        'id', o.id,
                        'sticker_id', o.sticker_id,
                        'image_url', s.image_url,
                        'pos_x', o.pos_x,
                        'pos_y', o.pos_y,
                        'scale', o.scale,
                        'rotation_deg', o.rotation_deg,
                        'z_index', o.z_index
                      ))
               FROM media_sticker_overlays o
               JOIN stickers s ON s.id = o.sticker_id
               WHERE o.media_id = m.id) AS stickers
       FROM album_media m
       LEFT JOIN media_tag_map mt ON mt.media_id = m.id
       LEFT JOIN photo_tags t     ON t.id = mt.tag_id
       WHERE m.album_id = ? AND m.status = 'active'
       GROUP BY m.id
       ORDER BY m.sort_order ASC, m.taken_at ASC`,
      [album.id],
    );

    // Lấy danh sách tag của album
    const [tags] = await db.execute(
      `SELECT * FROM photo_tags WHERE album_id = ? ORDER BY created_at DESC`,
      [album.id],
    );

    await Album.incrementView(album.id);

    res.json({ album, media, tags });
  } catch (err) {
    console.error("getAlbum:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── DANH SÁCH ALBUM CỦA USER ────────────────────────────────
// GET /api/albums/my
const getMyAlbums = async (req, res) => {
  try {
    const albums = await Album.findByOwner(req.user.id);
    res.json({ albums });
  } catch (err) {
    console.error("getMyAlbums:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── CẬP NHẬT ALBUM ──────────────────────────────────────────
// PUT /api/albums/:id
const updateAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album)
      return res.status(404).json({ message: "Không tìm thấy album" });

    if (album.owner_id !== req.user.id)
      return res.status(403).json({ message: "Chỉ chủ album mới được sửa" });

    await Album.update(req.params.id, req.body);
    const updated = await Album.findById(req.params.id);
    res.json({ message: "Cập nhật thành công", album: updated });
  } catch (err) {
    console.error("updateAlbum:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── XÓA ALBUM ───────────────────────────────────────────────
// DELETE /api/albums/:id
const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album)
      return res.status(404).json({ message: "Không tìm thấy album" });

    if (album.owner_id !== req.user.id)
      return res.status(403).json({ message: "Chỉ chủ album mới được xóa" });

    await Album.delete(req.params.id);
    res.json({ message: "Đã xóa album" });
  } catch (err) {
    console.error("deleteAlbum:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── THÊM TAG ────────────────────────────────────────────────
// POST /api/albums/:id/tags
// Body: { label, color }
const createTag = async (req, res) => {
  try {
    const { label, color } = req.body;
    if (!label) return res.status(400).json({ message: "Thiếu tên tag" });

    const canEdit = await Album.canEdit(req.params.id, req.user.id);
    if (!canEdit)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa album này" });

    const [result] = await db.execute(
      `INSERT INTO photo_tags (album_id, label, color) VALUES (?, ?, ?)`,
      [req.params.id, label, color || null],
    );
    res.status(201).json({
      message: "Thêm tag thành công",
      id: result.insertId,
      label,
      color,
    });
  } catch (err) {
    console.error("createTag:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── XÓA TAG ─────────────────────────────────────────────────
// DELETE /api/albums/:id/tags/:tagId
const deleteTag = async (req, res) => {
  try {
    const canEdit = await Album.canEdit(req.params.id, req.user.id);
    if (!canEdit)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa album này" });

    await db.execute(`DELETE FROM photo_tags WHERE id = ? AND album_id = ?`, [
      req.params.tagId,
      req.params.id,
    ]);
    res.json({ message: "Đã xóa tag" });
  } catch (err) {
    console.error("deleteTag:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN FUNCTIONS ─────────────────────────────────────────
// GET /api/albums/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const stats = await Album.getAdminStats();
    res.json({ stats });
  } catch (err) {
    console.error("getAdminStats:", err);
    res.status(500).json({ message: "Lỗi thống kê album" });
  }
};

// GET /api/albums/admin/list
const getAdminList = async (req, res) => {
  try {
    const data = await Album.getAdminList(req.query);
    res.json(data);
  } catch (err) {
    console.error("getAdminList:", err);
    res.status(500).json({ message: "Lỗi nạp danh sách album" });
  }
};

// PATCH /api/albums/admin/:id/status
const updateAdminStatus = async (req, res) => {
  try {
    const { is_public, status } = req.body;
    await Album.updateAdminStatus(req.params.id, { is_public, status });
    res.json({ message: "Cập nhật trạng thái album thành công" });
  } catch (err) {
    console.error("updateAdminStatus:", err);
    res.status(500).json({ message: "Lỗi cập nhật album" });
  }
};

module.exports = {
  createAlbum,
  getAlbum,
  getMyAlbums,
  updateAlbum,
  deleteAlbum,
  createTag,
  deleteTag,
  getAdminStats,
  getAdminList,
  updateAdminStatus,
};
