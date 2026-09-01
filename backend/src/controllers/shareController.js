const db = require("../config/db");
const Album = require("../models/Album");
const { emitToAlbum } = require("../config/socket");
const {
  sendShareRequestEmail,
  sendShareApprovedEmail,
} = require("../utils/email");

// ─── XIN QUYỀN EDIT ALBUM ────────────────────────────────────
// POST /api/albums/:id/share/request
const requestEdit = async (req, res) => {
  try {
    const album_id = req.params.id;
    const user_id = req.user.id;

    const album = await Album.findById(album_id);
    if (!album)
      return res.status(404).json({ message: "Không tìm thấy album" });

    if (album.owner_id === user_id)
      return res.status(400).json({ message: "Bạn là chủ album này" });

    // Kiểm tra đã gửi yêu cầu chưa — chỉ chặn khi đang pending hoặc đã
    // approved. Nếu trước đó bị reject/revoked thì cho phép xin lại.
    const [existing] = await db.execute(
      `SELECT * FROM album_shares WHERE album_id = ? AND user_id = ?`,
      [album.id, user_id],
    );
    if (existing.length && ["pending", "approved"].includes(existing[0].status))
      return res.status(409).json({
        message:
          existing[0].status === "pending"
            ? "Bạn đã gửi yêu cầu trước đó, đang chờ duyệt"
            : "Bạn đã có quyền edit album này",
        status: existing[0].status,
      });

    // album_shares có UNIQUE(album_id, user_id) nên không thể INSERT thêm
    // dòng mới nếu đã từng có (kể cả rejected/revoked) -> dùng UPSERT để
    // "mở lại" yêu cầu về trạng thái pending thay vì insert dòng mới.
    await db.execute(
      `INSERT INTO album_shares (album_id, user_id, permission, status)
       VALUES (?, ?, 'edit', 'pending')
       ON DUPLICATE KEY UPDATE status = 'pending', requested_at = NOW(), approved_at = NULL`,
      [album.id, user_id],
    );

    emitToAlbum(album.id, album.share_code, "collaborator_requested", {
      albumId: album.id,
      userId: user_id,
    });

    // Gửi email cho chủ album
    const [owner] = await db.execute(`SELECT * FROM users WHERE id = ?`, [
      album.owner_id,
    ]);
    const [requester] = await db.execute(`SELECT * FROM users WHERE id = ?`, [
      user_id,
    ]);
    if (owner[0] && requester[0]) {
      await sendShareRequestEmail(owner[0].email, {
        ownerName: owner[0].name,
        requesterName: requester[0].name,
        albumTitle: album.title || album.province_name,
        albumId: album.id,
      });
    }

    res
      .status(201)
      .json({ message: "Đã gửi yêu cầu xin quyền edit, chờ chủ album duyệt" });
  } catch (err) {
    console.error("requestEdit:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── CHỦ ALBUM DUYỆT / TỪ CHỐI ──────────────────────────────
// PUT /api/albums/:id/share/:shareId
// Body: { action: 'approve' | 'reject' }
const reviewRequest = async (req, res) => {
  try {
    const { action } = req.body;
    if (!["approve", "reject"].includes(action))
      return res
        .status(400)
        .json({ message: "action phải là approve hoặc reject" });

    const album = await Album.findById(req.params.id);
    if (!album)
      return res.status(404).json({ message: "Không tìm thấy album" });

    if (album.owner_id !== req.user.id)
      return res.status(403).json({ message: "Chỉ chủ album mới được duyệt" });

    const newStatus = action === "approve" ? "approved" : "rejected";
    const [result] = await db.execute(
      `UPDATE album_shares SET status = ?, approved_at = ${action === "approve" ? "NOW()" : "NULL"}
       WHERE id = ? AND album_id = ?`,
      [newStatus, req.params.shareId, album.id],
    );

    if (!result.affectedRows)
      return res.status(404).json({ message: "Không tìm thấy yêu cầu" });

    emitToAlbum(album.id, album.share_code, "collaborator_reviewed", {
      albumId: album.id,
      action,
      shareId: req.params.shareId,
    });

    // Gửi email thông báo cho người xin
    if (action === "approve") {
      const [share] = await db.execute(
        `SELECT * FROM album_shares WHERE id = ?`,
        [req.params.shareId],
      );
      const [user] = await db.execute(`SELECT * FROM users WHERE id = ?`, [
        share[0].user_id,
      ]);
      if (user[0]) {
        await sendShareApprovedEmail(user[0].email, {
          userName: user[0].name,
          albumTitle: album.title || album.province_name,
          albumId: album.id,
        });
      }
    }

    res.json({
      message:
        action === "approve" ? "Đã duyệt quyền edit" : "Đã từ chối yêu cầu",
    });
  } catch (err) {
    console.error("reviewRequest:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── CHỦ ALBUM THU HỒI QUYỀN ─────────────────────────────────
// DELETE /api/albums/:id/share/:shareId
const revokeAccess = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album || album.owner_id !== req.user.id)
      return res.status(403).json({ message: "Không có quyền" });

    await db.execute(
      `UPDATE album_shares SET status = 'revoked' WHERE id = ? AND album_id = ?`,
      [req.params.shareId, album.id],
    );

    emitToAlbum(album.id, album.share_code, "collaborator_revoked", {
      albumId: album.id,
      shareId: req.params.shareId,
    });

    res.json({ message: "Đã thu hồi quyền truy cập" });
  } catch (err) {
    console.error("revokeAccess:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── XEM DANH SÁCH CỘNG TÁC VIÊN ────────────────────────────
// GET /api/albums/:id/share
const getCollaborators = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album)
      return res.status(404).json({ message: "Không tìm thấy album" });

    if (album.owner_id !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({
        message: "Chỉ chủ album hoặc Quản trị viên mới được xem danh sách cộng tác viên",
      });

    const [shares] = await db.execute(
      `SELECT s.*, u.name, u.email
       FROM album_shares s
       JOIN users u ON u.id = s.user_id
       WHERE s.album_id = ? AND s.status IN ('pending', 'approved')
       ORDER BY s.requested_at DESC`,
      [album.id],
    );
    res.json({ collaborators: shares });
  } catch (err) {
    console.error("getCollaborators:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { requestEdit, reviewRequest, revokeAccess, getCollaborators };
