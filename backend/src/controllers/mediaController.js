const cloudinary = require("../config/cloudinary");
const { visionModel } = require("../config/gemini");
const {
  uploadSingle,
  uploadMultiple,
  runMiddleware,
} = require("../middleware/upload");
const db = require("../config/db");

// ─── HELPER: upload buffer lên Cloudinary ────────────────────
const uploadToCloudinary = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });

// ─── HELPER: fetch ảnh URL → base64 ─────────────────────────
const fetchImageAsBase64 = async (url) => {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
};

// ─── HELPER: Gemini AI caption ───────────────────────────────
const getAiCaption = async (imageUrl) => {
  try {
    const result = await visionModel.generateContent([
      "Bạn là trợ lý du lịch Việt Nam. Hãy viết 1 caption ngắn gọn, cảm xúc bằng tiếng Việt (tối đa 2 câu) mô tả bức ảnh du lịch này. Chỉ trả về caption, không thêm gì khác.",
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: await fetchImageAsBase64(imageUrl),
        },
      },
    ]);
    return result.response.text().trim();
  } catch (err) {
    console.error("Gemini caption error:", err.message);
    return null; // Không fail upload nếu AI lỗi
  }
};

// ─── HELPER: kiểm tra quyền upload vào album ─────────────────
// Admin luôn được phép — dùng để chuẩn bị nội dung sẵn cho khách
// (xem provisionCard ở nfcController.js) trước khi giao/ghi thẻ NFC.
const checkUploadPermission = async (album_id, user_id, role) => {
  if (role === "admin") return true;

  const [rows] = await db.execute(
    `SELECT a.id FROM albums a
     LEFT JOIN album_shares s
       ON s.album_id = a.id AND s.user_id = ? AND s.status = 'approved' AND s.permission = 'edit'
     WHERE a.id = ? AND a.status = 'active'
       AND (a.owner_id = ? OR s.id IS NOT NULL)`,
    [user_id, album_id, user_id],
  );
  return rows.length > 0;
};

// ─── HELPER: lấy album_id từ 1 media_id — dùng để kiểm tra quyền
// sửa sticker/tag khi request chỉ có media_id chứ chưa có album_id.
const getAlbumIdByMedia = async (mediaId) => {
  const [rows] = await db.execute(
    `SELECT album_id FROM album_media WHERE id = ? AND status = 'active'`,
    [mediaId],
  );
  return rows[0]?.album_id || null;
};

// ─── HELPER: lấy album_id từ 1 overlayId (sticker dán trên ảnh) ─
const getAlbumIdByOverlay = async (overlayId) => {
  const [rows] = await db.execute(
    `SELECT m.album_id
     FROM media_sticker_overlays o
     JOIN album_media m ON m.id = o.media_id
     WHERE o.id = ?`,
    [overlayId],
  );
  return rows[0]?.album_id || null;
};

// ─── UPLOAD 1 FILE ───────────────────────────────────────────
// POST /api/media/upload
// Form-data: file, album_id, taken_at (optional)
const uploadMedia = async (req, res) => {
  try {
    await runMiddleware(req, res, uploadSingle);

    if (!req.file)
      return res.status(400).json({ message: "Không tìm thấy file" });

    const { album_id, taken_at } = req.body;
    if (!album_id) return res.status(400).json({ message: "Thiếu album_id" });

    if (!(await checkUploadPermission(album_id, req.user.id, req.user.role)))
      return res
        .status(403)
        .json({ message: "Bạn không có quyền upload vào album này" });

    const isVideo = req.file.mimetype.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";

    const uploaded = await uploadToCloudinary(req.file.buffer, {
      folder: `vinatap/albums/${album_id}`,
      resource_type: resourceType,
    });

    let thumbnail_url = null;
    if (isVideo) {
      thumbnail_url = cloudinary.url(uploaded.public_id, {
        resource_type: "video",
        format: "jpg",
        transformation: [{ width: 400, crop: "scale" }],
      });
    }

    const caption_ai = isVideo ? null : await getAiCaption(uploaded.secure_url);

    const [result] = await db.execute(
      `INSERT INTO album_media
         (album_id, uploader_id, media_type, file_url, thumbnail_url,
          duration_sec, caption_ai, taken_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        album_id,
        req.user.id,
        isVideo ? "video" : "photo",
        uploaded.secure_url,
        thumbnail_url,
        uploaded.duration ? Math.round(uploaded.duration) : null,
        caption_ai,
        taken_at || null,
      ],
    );

    res.status(201).json({
      message: "Upload thành công",
      media: {
        id: result.insertId,
        file_url: uploaded.secure_url,
        thumbnail_url,
        media_type: isVideo ? "video" : "photo",
        caption_ai,
      },
    });
  } catch (err) {
    console.error("uploadMedia:", err);
    res.status(500).json({ message: "Lỗi upload: " + err.message });
  }
};

// ─── UPLOAD NHIỀU FILE ───────────────────────────────────────
// POST /api/media/upload-multiple
const uploadMultipleMedia = async (req, res) => {
  try {
    await runMiddleware(req, res, uploadMultiple);

    if (!req.files?.length)
      return res.status(400).json({ message: "Không tìm thấy file nào" });

    const { album_id } = req.body;
    if (!album_id) return res.status(400).json({ message: "Thiếu album_id" });

    if (!(await checkUploadPermission(album_id, req.user.id, req.user.role)))
      return res
        .status(403)
        .json({ message: "Bạn không có quyền upload vào album này" });

    const results = [];
    for (const file of req.files) {
      const isVideo = file.mimetype.startsWith("video/");
      const uploaded = await uploadToCloudinary(file.buffer, {
        folder: `vinatap/albums/${album_id}`,
        resource_type: isVideo ? "video" : "image",
      });

      let thumbnail_url = null;
      if (isVideo) {
        thumbnail_url = cloudinary.url(uploaded.public_id, {
          resource_type: "video",
          format: "jpg",
          transformation: [{ width: 400, crop: "scale" }],
        });
      }

      const caption_ai = isVideo
        ? null
        : await getAiCaption(uploaded.secure_url);

      const [result] = await db.execute(
        `INSERT INTO album_media
           (album_id, uploader_id, media_type, file_url, thumbnail_url,
            duration_sec, caption_ai, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
        [
          album_id,
          req.user.id,
          isVideo ? "video" : "photo",
          uploaded.secure_url,
          thumbnail_url,
          uploaded.duration ? Math.round(uploaded.duration) : null,
          caption_ai,
        ],
      );

      results.push({
        id: result.insertId,
        file_url: uploaded.secure_url,
        caption_ai,
      });
    }

    res.status(201).json({
      message: `Upload ${results.length} file thành công`,
      media: results,
    });
  } catch (err) {
    console.error("uploadMultipleMedia:", err);
    res.status(500).json({ message: "Lỗi upload: " + err.message });
  }
};

// ─── SỬA CAPTION / SORT ORDER ────────────────────────────────
// PUT /api/media/:id
const updateMedia = async (req, res) => {
  try {
    const { caption_user, sort_order, taken_at } = req.body;
    const [result] = await db.execute(
      `UPDATE album_media
       SET caption_user = ?, sort_order = ?, taken_at = ?
       WHERE id = ? AND uploader_id = ? AND status = 'active'`,
      [
        caption_user || null,
        sort_order || 0,
        taken_at || null,
        req.params.id,
        req.user.id,
      ],
    );
    if (!result.affectedRows)
      return res
        .status(404)
        .json({ message: "Không tìm thấy media hoặc không có quyền" });

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("updateMedia:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── XÓA MEDIA ───────────────────────────────────────────────
// DELETE /api/media/:id
const deleteMedia = async (req, res) => {
  try {
    const [result] = await db.execute(
      `UPDATE album_media SET status = 'deleted'
       WHERE id = ? AND uploader_id = ? AND status = 'active'`,
      [req.params.id, req.user.id],
    );
    if (!result.affectedRows)
      return res
        .status(404)
        .json({ message: "Không tìm thấy media hoặc không có quyền" });

    res.json({ message: "Đã xóa" });
  } catch (err) {
    console.error("deleteMedia:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── THÊM STICKER LÊN ẢNH ────────────────────────────────────
// POST /api/media/:id/stickers
const addStickerOverlay = async (req, res) => {
  try {
    const { sticker_id, pos_x, pos_y, scale, rotation_deg, z_index } = req.body;
    if (!sticker_id)
      return res.status(400).json({ message: "Thiếu sticker_id" });

    const albumId = await getAlbumIdByMedia(req.params.id);
    if (!albumId)
      return res.status(404).json({ message: "Không tìm thấy media" });

    if (!(await checkUploadPermission(albumId, req.user.id, req.user.role)))
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa ảnh này" });

    const [result] = await db.execute(
      `INSERT INTO media_sticker_overlays
         (media_id, sticker_id, pos_x, pos_y, scale, rotation_deg, z_index)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.params.id,
        sticker_id,
        pos_x || 0,
        pos_y || 0,
        scale || 1.0,
        rotation_deg || 0,
        z_index || 0,
      ],
    );
    res
      .status(201)
      .json({ message: "Thêm sticker thành công", id: result.insertId });
  } catch (err) {
    console.error("addStickerOverlay:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── CẬP NHẬT VỊ TRÍ STICKER ─────────────────────────────────
// PUT /api/media/stickers/:overlayId
const updateStickerOverlay = async (req, res) => {
  try {
    const { pos_x, pos_y, scale, rotation_deg, z_index } = req.body;

    const albumId = await getAlbumIdByOverlay(req.params.overlayId);
    if (!albumId)
      return res
        .status(404)
        .json({ message: "Không tìm thấy sticker overlay" });

    if (!(await checkUploadPermission(albumId, req.user.id, req.user.role)))
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa sticker này" });

    const [result] = await db.execute(
      `UPDATE media_sticker_overlays
       SET pos_x = ?, pos_y = ?, scale = ?, rotation_deg = ?, z_index = ?
       WHERE id = ?`,
      [pos_x, pos_y, scale, rotation_deg, z_index, req.params.overlayId],
    );
    if (!result.affectedRows)
      return res
        .status(404)
        .json({ message: "Không tìm thấy sticker overlay" });

    res.json({ message: "Cập nhật sticker thành công" });
  } catch (err) {
    console.error("updateStickerOverlay:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── XÓA STICKER KHỎI ẢNH ────────────────────────────────────
// DELETE /api/media/stickers/:overlayId
const deleteStickerOverlay = async (req, res) => {
  try {
    const albumId = await getAlbumIdByOverlay(req.params.overlayId);
    if (!albumId)
      return res
        .status(404)
        .json({ message: "Không tìm thấy sticker overlay" });

    if (!(await checkUploadPermission(albumId, req.user.id, req.user.role)))
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa sticker này" });

    await db.execute(`DELETE FROM media_sticker_overlays WHERE id = ?`, [
      req.params.overlayId,
    ]);
    res.json({ message: "Đã xóa sticker" });
  } catch (err) {
    console.error("deleteStickerOverlay:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── GẮN TAG VÀO MEDIA ───────────────────────────────────────
// POST /api/media/:id/tags
// Body: { tag_id }
// ✅ FIX: thêm album_id vào INSERT cho đúng schema v2.1
const addTagToMedia = async (req, res) => {
  try {
    const { tag_id } = req.body;
    if (!tag_id) return res.status(400).json({ message: "Thiếu tag_id" });

    // Lấy album_id từ media để insert composite FK đúng schema v2.1
    const [mediaRows] = await db.execute(
      `SELECT album_id FROM album_media WHERE id = ? AND status = 'active'`,
      [req.params.id],
    );
    if (!mediaRows.length)
      return res.status(404).json({ message: "Không tìm thấy media" });

    const album_id = mediaRows[0].album_id;

    if (!(await checkUploadPermission(album_id, req.user.id, req.user.role)))
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa ảnh này" });

    // Kiểm tra tag thuộc cùng album
    const [tagRows] = await db.execute(
      `SELECT id FROM photo_tags WHERE id = ? AND album_id = ?`,
      [tag_id, album_id],
    );
    if (!tagRows.length)
      return res.status(400).json({ message: "Tag không thuộc album này" });

    // ✅ INSERT đúng 3 cột theo schema v2.1: album_id, media_id, tag_id
    await db.execute(
      `INSERT IGNORE INTO media_tag_map (album_id, media_id, tag_id) VALUES (?, ?, ?)`,
      [album_id, req.params.id, tag_id],
    );

    res.json({ message: "Gắn tag thành công" });
  } catch (err) {
    console.error("addTagToMedia:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── BỎ TAG KHỎI MEDIA ───────────────────────────────────────
// DELETE /api/media/:id/tags/:tagId
const removeTagFromMedia = async (req, res) => {
  try {
    const albumId = await getAlbumIdByMedia(req.params.id);
    if (!albumId)
      return res.status(404).json({ message: "Không tìm thấy media" });

    if (!(await checkUploadPermission(albumId, req.user.id, req.user.role)))
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa ảnh này" });

    await db.execute(
      `DELETE FROM media_tag_map WHERE media_id = ? AND tag_id = ?`,
      [req.params.id, req.params.tagId],
    );
    res.json({ message: "Đã bỏ tag" });
  } catch (err) {
    console.error("removeTagFromMedia:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  uploadMedia,
  uploadMultipleMedia,
  updateMedia,
  deleteMedia,
  addStickerOverlay,
  updateStickerOverlay,
  deleteStickerOverlay,
  addTagToMedia,
  removeTagFromMedia,
};
