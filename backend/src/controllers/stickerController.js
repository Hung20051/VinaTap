const cloudinary = require("../config/cloudinary");
const { uploadSingle, runMiddleware } = require("../middleware/upload");
const db = require("../config/db");

// ─── LẤY TẤT CẢ STICKER (customer + guest) ───────────────────
// GET /api/stickers
const getAllStickers = async (req, res) => {
  try {
    const { category } = req.query;
    let sql = `SELECT * FROM stickers WHERE status = 'active'`;
    const vals = [];
    if (category) {
      sql += ` AND category = ?`;
      vals.push(category);
    }
    sql += ` ORDER BY sort_order ASC, created_at DESC`;

    const [stickers] = await db.execute(sql, vals);
    res.json({ stickers });
  } catch (err) {
    console.error("getAllStickers:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: UPLOAD STICKER MỚI ────────────────────────────────
// POST /api/stickers
// Form-data: file (PNG), name, category, sort_order
const createSticker = async (req, res) => {
  try {
    await runMiddleware(req, res, uploadSingle);

    if (!req.file)
      return res.status(400).json({ message: "Thiếu file sticker" });

    const { name, category, sort_order } = req.body;
    if (!name) return res.status(400).json({ message: "Thiếu tên sticker" });

    // Upload lên Cloudinary folder stickers
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "vinatap/stickers", format: "png" },
        (err, result) => (err ? reject(err) : resolve(result)),
      );
      stream.end(req.file.buffer);
    });

    const [result] = await db.execute(
      `INSERT INTO stickers (name, image_url, category, sort_order, status)
       VALUES (?, ?, ?, ?, 'active')`,
      [name, uploaded.secure_url, category || null, sort_order || 0],
    );

    res.status(201).json({
      message: "Thêm sticker thành công",
      sticker: {
        id: result.insertId,
        name,
        image_url: uploaded.secure_url,
        category,
      },
    });
  } catch (err) {
    console.error("createSticker:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: SỬA STICKER ───────────────────────────────────────
// PUT /api/stickers/:id
const updateSticker = async (req, res) => {
  try {
    const { name, category, sort_order, status } = req.body;
    await db.execute(
      `UPDATE stickers SET name = COALESCE(?, name),
                           category = COALESCE(?, category),
                           sort_order = COALESCE(?, sort_order),
                           status = COALESCE(?, status)
       WHERE id = ?`,
      [name, category, sort_order, status, req.params.id],
    );
    res.json({ message: "Cập nhật sticker thành công" });
  } catch (err) {
    console.error("updateSticker:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: XÓA MỀM STICKER ──────────────────────────────────
// DELETE /api/stickers/:id
const deleteSticker = async (req, res) => {
  try {
    await db.execute(`UPDATE stickers SET status = 'inactive' WHERE id = ?`, [
      req.params.id,
    ]);
    res.json({ message: "Đã ẩn sticker" });
  } catch (err) {
    console.error("deleteSticker:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllStickers,
  createSticker,
  updateSticker,
  deleteSticker,
};
