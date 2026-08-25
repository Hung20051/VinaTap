const Album = require("../models/Album");
const NfcCard = require("../models/NfcCard");
const db = require("../config/db");
const { emitToAlbum } = require("../config/socket");

// ── Throttle view count: mỗi IP + album chỉ tính 1 view / 5 phút ──
const recentViews = new Map();
const VIEW_COOLDOWN = 5 * 60 * 1000;
const MAX_VIEWS_MAP_SIZE = 10000;

setInterval(() => {
  const now = Date.now();
  for (const [key, ts] of recentViews.entries()) {
    if (now - ts > VIEW_COOLDOWN) recentViews.delete(key);
  }
  if (recentViews.size > MAX_VIEWS_MAP_SIZE) {
    recentViews.clear();
  }
}, 10 * 60 * 1000);

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
    if (existing) {
      return res
        .status(200)
        .json({ message: "Album đã tồn tại cho thẻ này", album: existing });
    }

    const { id: newAlbumId } = await Album.create({
      nfc_card_id,
      owner_id: req.user.id,
      title: req.body.title,
    });
    const album = await Album.findById(newAlbumId);

    res.status(201).json({ message: "Tạo album thành công", album });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      const existing = await Album.findByNfcCard(req.body.nfc_card_id);
      return res
        .status(200)
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

    // Nếu album đang bị tạm khóa (archived) thì CHỈ chủ sở hữu hoặc admin mới xem được
    if (album.status === "archived") {
      const isOwnerOrAdmin = req.user && (album.owner_id === req.user.id || req.user.role === "admin");
      if (!isOwnerOrAdmin) {
        return res.status(403).json({
          message: `Album này đang bị tạm khóa bởi Quản trị viên${album.locked_reason ? ` (${album.locked_reason})` : ""}.`,
          is_locked: true,
          locked_reason: album.locked_reason,
        });
      }
    }

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

    // Tính quyền của người dùng hiện tại đối với album này
    let user_role = "guest"; // 'owner' | 'admin' | 'collaborator' | 'pending_collaborator' | 'guest'
    if (req.user) {
      if (req.user.id === album.owner_id) {
        user_role = "owner";
      } else if (req.user.role === "admin") {
        user_role = "admin";
      } else {
        const [shares] = await db.execute(
          `SELECT * FROM album_shares WHERE album_id = ? AND user_id = ?`,
          [album.id, req.user.id],
        );
        if (shares.length) {
          if (shares[0].status === "approved") {
            user_role = "collaborator";
          } else if (shares[0].status === "pending") {
            user_role = "pending_collaborator";
          }
        }
      }
    }

    const can_edit = ["owner", "admin", "collaborator"].includes(user_role);

    // Chỉ tăng lượt xem nếu KHÔNG PHẢI chính chủ sở hữu album xem
    if (!req.user || req.user.id !== album.owner_id) {
      const viewKey = `${req.ip}_${album.id}`;
      if (!recentViews.has(viewKey) || Date.now() - recentViews.get(viewKey) > VIEW_COOLDOWN) {
        recentViews.set(viewKey, Date.now());
        await Album.incrementView(album.id);
      }
    }

    res.json({
      album: {
        ...album,
        user_role,
        can_edit,
      },
      media,
      tags,
    });
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

    if (album.owner_id !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Chỉ chủ album mới được sửa" });

    if (album.status === "archived" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Album này đang bị Quản trị viên tạm khóa, không thể chỉnh sửa nội dung.",
      });
    }

    // Whitelist chỉ cho phép sửa các trường an toàn trong bảng albums
    const { title, description, is_public, theme_sticker_id, cover_photo_id } = req.body;
    const safeData = {};
    if (title !== undefined) safeData.title = title;
    if (description !== undefined) safeData.description = description;
    if (is_public !== undefined) safeData.is_public = is_public;
    if (theme_sticker_id !== undefined) safeData.theme_sticker_id = theme_sticker_id;
    if (cover_photo_id !== undefined) safeData.cover_photo_id = cover_photo_id;

    await Album.update(req.params.id, safeData);
    const updated = await Album.findById(req.params.id);
    emitToAlbum(album.id, album.share_code, "album_updated", { album: updated });
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

    if (album.owner_id !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Không có quyền xóa album này" });

    await Album.delete(req.params.id);
    emitToAlbum(album.id, album.share_code, "album_deleted", { albumId: album.id });
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

    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: "Không tìm thấy album" });

    const canEdit = await Album.canEdit(album.id, req.user.id);
    if (!canEdit)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa album này" });

    const [result] = await db.execute(
      `INSERT INTO photo_tags (album_id, label, color) VALUES (?, ?, ?)`,
      [album.id, label, color || null],
    );
    const newTag = {
      id: result.insertId,
      album_id: album.id,
      label,
      color,
    };
    emitToAlbum(album.id, album.share_code, "tag_created", { tag: newTag });
    res.status(201).json({
      message: "Thêm tag thành công",
      tag: newTag,
      ...newTag,
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
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: "Không tìm thấy album" });

    const canEdit = await Album.canEdit(album.id, req.user.id);
    if (!canEdit)
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa album này" });

    await db.execute(`DELETE FROM photo_tags WHERE id = ? AND album_id = ?`, [
      req.params.tagId,
      album.id,
    ]);
    emitToAlbum(album.id, album.share_code, "tag_deleted", {
      tagId: Number(req.params.tagId),
    });
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

// GET /api/albums/admin/reports
const getAdminReports = async (req, res) => {
  try {
    const data = await Album.getAdminReports(req.query);
    res.json(data);
  } catch (err) {
    console.error("getAdminReports:", err);
    res.status(500).json({ message: "Lỗi nạp danh sách báo cáo" });
  }
};

// POST /api/albums/admin/reports/:id/resolve
const resolveReport = async (req, res) => {
  try {
    const reportId = req.params.id;
    const { action, admin_notes, locked_reason } = req.body; // action: 'lock' | 'dismiss'
    
    const [reports] = await db.execute(`SELECT * FROM album_reports WHERE id = ?`, [reportId]);
    if (!reports.length) return res.status(404).json({ message: "Không tìm thấy báo cáo" });

    const report = reports[0];

    if (action === "lock") {
      await Album.updateAdminStatus(report.album_id, {
        status: "archived",
        locked_reason: locked_reason || report.reason || "Nội dung vi phạm chính sách cộng đồng",
      });
      await db.execute(
        `UPDATE album_reports SET status = 'resolved', admin_notes = ? WHERE id = ?`,
        [admin_notes || "Đã khóa album", reportId],
      );
    } else {
      await db.execute(
        `UPDATE album_reports SET status = 'dismissed', admin_notes = ? WHERE id = ?`,
        [admin_notes || "Báo cáo không chính xác / Đã bỏ qua", reportId],
      );
    }

    res.json({ message: action === "lock" ? "Đã khóa album và xử lý báo cáo" : "Đã bỏ qua báo cáo" });
  } catch (err) {
    console.error("resolveReport:", err);
    res.status(500).json({ message: "Lỗi xử lý báo cáo" });
  }
};

// POST /api/albums/:id/report
const reportAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;
    const { reason, description, email } = req.body;
    if (!reason) return res.status(400).json({ message: "Vui lòng chọn lý do báo cáo" });

    const album = await Album.findById(albumId);
    if (!album) return res.status(404).json({ message: "Không tìm thấy album" });

    await db.execute(
      `INSERT INTO album_reports (album_id, reporter_user_id, reporter_email, reason, description, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [
        album.id,
        req.user?.id || null,
        email || req.user?.email || null,
        reason,
        description || null,
      ],
    );

    res.status(201).json({ message: "Cảm ơn bạn đã gửi báo cáo. Quản trị viên sẽ kiểm tra và xử lý." });
  } catch (err) {
    console.error("reportAlbum:", err);
    res.status(500).json({ message: "Lỗi khi gửi báo cáo" });
  }
};

// PATCH /api/albums/admin/:id/status
const updateAdminStatus = async (req, res) => {
  try {
    const { is_public, status, locked_reason } = req.body;
    const ALLOWED_STATUSES = ["active", "archived", "deleted"];
    if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ (chỉ chấp nhận: active, archived, deleted)",
      });
    }

    await Album.updateAdminStatus(req.params.id, { is_public, status, locked_reason });
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
  getAdminReports,
  resolveReport,
  reportAlbum,
  updateAdminStatus,
};
