const cloudinary = require("../config/cloudinary");
const {
  uploadImageOnly,
  uploadImagesOnly,
  runMiddleware,
} = require("../middleware/upload");
const db = require("../config/db");

// ─── HELPER: Làm sạch mảng category slugs (bỏ ngoặc vuông, ngoặc kép, backslash...) ─
const extractCleanSlugs = (input) => {
  if (input === undefined || input === null) return [];
  let rawItems = [];

  if (Array.isArray(input)) {
    rawItems = input;
  } else if (typeof input === "string") {
    let str = input.trim();
    while (
      (str.startsWith("[") && str.endsWith("]")) ||
      (str.startsWith('"') && str.endsWith('"'))
    ) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) {
          rawItems = parsed;
          break;
        } else if (typeof parsed === "string") {
          str = parsed.trim();
        } else {
          break;
        }
      } catch {
        break;
      }
    }
    if (!rawItems.length) {
      rawItems = str.split(",");
    }
  }

  const result = [];
  const cleanOne = (val) => {
    let s = String(val).trim();
    s = s.replace(/^[\["'\\]+|[\]"'\\]+$/g, "").trim();
    if (s && s !== "[]" && s !== "null" && s !== "undefined") {
      result.push(s);
    }
  };

  rawItems.forEach((item) => {
    if (Array.isArray(item)) {
      item.forEach(cleanOne);
    } else {
      cleanOne(item);
    }
  });

  return Array.from(new Set(result));
};

// ─── HELPER: Gắn danh mục vào danh sách sticker ────────────────
const attachCategoriesToStickers = async (stickers) => {
  if (!stickers.length) return stickers;

  const stickerIds = stickers.map((s) => s.id);
  const placeholders = stickerIds.map(() => "?").join(",");

  const [maps] = await db.query(
    `SELECT m.sticker_id, c.id AS category_id, c.name AS category_name, c.slug AS category_slug
     FROM sticker_category_map m
     JOIN sticker_categories c ON c.id = m.category_id
     WHERE m.sticker_id IN (${placeholders})
     ORDER BY c.sort_order ASC`,
    stickerIds,
  );

  const categoryMap = {};
  maps.forEach((m) => {
    if (!categoryMap[m.sticker_id]) categoryMap[m.sticker_id] = [];
    categoryMap[m.sticker_id].push({
      id: m.category_id,
      name: m.category_name,
      slug: m.category_slug,
    });
  });

  return stickers.map((s) => {
    const cats = categoryMap[s.id] || [];
    const categorySlugs = extractCleanSlugs(cats.map((c) => c.slug));
    const legacyCats = extractCleanSlugs(s.category);
    const allCats = Array.from(new Set([...categorySlugs, ...legacyCats]));
    return {
      ...s,
      categories: allCats,
      category_details: cats,
      category: allCats.join(","),
    };
  });
};

// ─── HELPER: Cập nhật danh mục trong bảng sticker_category_map ─
const syncStickerCategories = async (stickerId, categoriesInput) => {
  if (categoriesInput === undefined || categoriesInput === null) return;

  // Xóa bỏ các dòng rác trong DB bị tạo nhầm trước đó nếu có
  try {
    await db.query(
      `DELETE FROM sticker_categories WHERE slug LIKE '%[%' OR slug LIKE '%"%' OR slug LIKE '%\\%' OR slug LIKE '%]%'`,
    );
  } catch (e) {}

  const cleanSlugsOrIds = extractCleanSlugs(categoriesInput);

  await db.execute(`DELETE FROM sticker_category_map WHERE sticker_id = ?`, [
    stickerId,
  ]);

  if (!cleanSlugsOrIds.length) return;

  // Lấy tất cả categories hợp lệ từ DB
  let [catRows] = await db.query(
    `SELECT id, slug FROM sticker_categories WHERE slug IN (?) OR id IN (?)`,
    [cleanSlugsOrIds, cleanSlugsOrIds.map((v) => Number(v) || 0)],
  );

  // Tìm các category slug mới chưa có trong DB để tự động tạo mới
  const existingSlugs = new Set(
    catRows.map((r) => String(r.slug).toLowerCase()),
  );
  const missingSlugs = cleanSlugsOrIds.filter(
    (item) => !Number(item) && !existingSlugs.has(String(item).toLowerCase()),
  );

  if (missingSlugs.length > 0) {
    const [[maxOrderRow]] = await db.query(
      `SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM sticker_categories`,
    );
    let startOrder = maxOrderRow?.max_order || 0;

    for (const slug of missingSlugs) {
      startOrder += 1;
      const name = slug.charAt(0).toUpperCase() + slug.slice(1);
      await db.execute(
        `INSERT IGNORE INTO sticker_categories (name, slug, sort_order) VALUES (?, ?, ?)`,
        [name, slug, startOrder],
      );
    }

    // Query lại danh mục sau khi đã tự động chèn thêm
    [catRows] = await db.query(
      `SELECT id, slug FROM sticker_categories WHERE slug IN (?) OR id IN (?)`,
      [cleanSlugsOrIds, cleanSlugsOrIds.map((v) => Number(v) || 0)],
    );
  }

  if (catRows.length) {
    const values = catRows.map((c) => [stickerId, c.id]);
    await db.query(
      `INSERT IGNORE INTO sticker_category_map (sticker_id, category_id) VALUES ?`,
      [values],
    );
  }

  // Dọn dẹp các danh mục tùy chỉnh không còn bất kỳ sticker nào dùng đến nữa
  try {
    await db.query(`
      DELETE c FROM sticker_categories c
      LEFT JOIN sticker_category_map m ON m.category_id = c.id
      WHERE m.category_id IS NULL AND c.id > 4
    `);
  } catch (e) {}
};

// ─── LẤY TẤT CẢ DANH MỤC ─────────────────────────────────────
// GET /api/stickers/categories
const getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      `SELECT * FROM sticker_categories ORDER BY sort_order ASC, name ASC`,
    );
    res.json({ categories });
  } catch (err) {
    console.error("getAllCategories:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── LẤY TẤT CẢ STICKER (customer + guest) ───────────────────
// GET /api/stickers
const getAllStickers = async (req, res) => {
  try {
    const { category } = req.query;
    let sql = `SELECT s.* FROM stickers s WHERE s.status = 'active'`;
    const vals = [];
    if (category) {
      sql = `SELECT DISTINCT s.* FROM stickers s
             JOIN sticker_category_map m ON m.sticker_id = s.id
             JOIN sticker_categories c ON c.id = m.category_id
             WHERE s.status = 'active' AND (c.slug = ? OR s.category LIKE ?)`;
      vals.push(category, `%${category}%`);
    }
    sql += ` ORDER BY s.sort_order ASC, s.created_at DESC`;

    const [rows] = await db.execute(sql, vals);
    const stickers = await attachCategoriesToStickers(rows);
    const [categories] = await db.query(
      `SELECT * FROM sticker_categories ORDER BY sort_order ASC`,
    );

    res.json({ stickers, categories });
  } catch (err) {
    console.error("getAllStickers:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: LẤY TẤT CẢ STICKER (gồm cả đã ẩn + lượt dùng) ────
// GET /api/stickers/admin
const getAllStickersAdmin = async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT s.*, COUNT(o.id) AS usage_count
       FROM stickers s
       LEFT JOIN media_sticker_overlays o ON o.sticker_id = s.id
       GROUP BY s.id
       ORDER BY s.sort_order ASC, s.created_at DESC`,
    );
    const stickers = await attachCategoriesToStickers(rows);
    const [categories] = await db.query(
      `SELECT * FROM sticker_categories ORDER BY sort_order ASC`,
    );

    res.json({ stickers, categories });
  } catch (err) {
    console.error("getAllStickersAdmin:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── HELPER: upload buffer ảnh lên Cloudinary folder stickers ──
const uploadStickerImage = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "vinatap/stickers", format: "png" },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });

// ─── ADMIN: UPLOAD STICKER MỚI (1 ảnh) ────────────────────────
// POST /api/stickers
const createSticker = async (req, res) => {
  try {
    await runMiddleware(req, res, uploadImageOnly);

    if (!req.file)
      return res.status(400).json({ message: "Thiếu file sticker" });

    const { name, category, categories, sort_order } = req.body;
    if (!name) return res.status(400).json({ message: "Thiếu tên sticker" });

    // Tính toán sort_order tự động nếu không truyền hoặc bằng 0
    let finalOrder = Number(sort_order) || 0;
    if (!finalOrder) {
      const [[maxRow]] = await db.query(
        `SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM stickers`,
      );
      finalOrder = (maxRow?.max_order || 0) + 1;
    }

    const uploaded = await uploadStickerImage(req.file.buffer);

    const categoryInput = categories || category || "";

    const [result] = await db.execute(
      `INSERT INTO stickers (name, image_url, category, sort_order, status)
       VALUES (?, ?, ?, ?, 'active')`,
      [name, uploaded.secure_url, String(categoryInput), finalOrder],
    );

    const stickerId = result.insertId;

    // Cập nhật bảng liên kết nhiều - nhiều
    await syncStickerCategories(stickerId, categoryInput);

    const [newStickerRows] = await db.query(
      `SELECT s.*, 0 AS usage_count FROM stickers s WHERE s.id = ?`,
      [stickerId],
    );
    const [fullSticker] = await attachCategoriesToStickers(newStickerRows);

    res.status(201).json({
      message: "Thêm sticker thành công",
      sticker: fullSticker,
    });
  } catch (err) {
    console.error("createSticker:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ─── ADMIN: UPLOAD NHIỀU STICKER CÙNG LÚC ────────────────────
// POST /api/stickers/bulk
const bulkCreateStickers = async (req, res) => {
  try {
    await runMiddleware(req, res, uploadImagesOnly);

    if (!req.files || !req.files.length)
      return res.status(400).json({ message: "Chưa chọn ảnh nào" });

    let meta;
    try {
      meta = JSON.parse(req.body.meta || "[]");
    } catch {
      return res.status(400).json({ message: "meta không hợp lệ" });
    }
    if (meta.length !== req.files.length)
      return res
        .status(400)
        .json({ message: "Số lượng tên/category không khớp số ảnh" });

    const created = [];
    const failed = [];

    const [[maxRow]] = await db.query(
      `SELECT COALESCE(MAX(sort_order), 0) AS max_order FROM stickers`,
    );
    let nextOrder = maxRow?.max_order || 0;

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const { name, category, categories } = meta[i] || {};
      if (!name) {
        failed.push({ index: i, reason: "Thiếu tên" });
        continue;
      }
      try {
        nextOrder++;
        const uploaded = await uploadStickerImage(file.buffer);
        const categoryInput = categories || category || "";
        const cleanCategoryStr = extractCleanSlugs(categoryInput).join(",");

        const [result] = await db.execute(
          `INSERT INTO stickers (name, image_url, category, sort_order, status)
           VALUES (?, ?, ?, ?, 'active')`,
          [name, uploaded.secure_url, cleanCategoryStr, nextOrder],
        );

        const stickerId = result.insertId;
        await syncStickerCategories(stickerId, categoryInput);

        created.push({
          id: stickerId,
          name,
          image_url: uploaded.secure_url,
          category: cleanCategoryStr,
          sort_order: nextOrder,
          status: "active",
          usage_count: 0,
        });
      } catch (err) {
        console.error(`bulkCreateStickers file[${i}]:`, err);
        failed.push({ index: i, reason: "Lỗi upload" });
      }
    }

    res.status(created.length ? 201 : 500).json({
      message: `Đã thêm ${created.length}/${req.files.length} sticker${
        failed.length ? `, ${failed.length} lỗi` : ""
      }`,
      created,
      failed,
    });
  } catch (err) {
    console.error("bulkCreateStickers:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ─── ADMIN: SỬA STICKER ───────────────────────────────────────
// PUT /api/stickers/:id
const updateSticker = async (req, res) => {
  try {
    await runMiddleware(req, res, uploadImageOnly);

    const { name, category, categories, sort_order, status } = req.body;

    let image_url = null;
    if (req.file) {
      const uploaded = await uploadStickerImage(req.file.buffer);
      image_url = uploaded.secure_url;
    }

    const toNull = (v) => (v === undefined ? null : v);
    const categoryInput = categories !== undefined ? categories : category;

    await db.execute(
      `UPDATE stickers SET name = COALESCE(?, name),
                           image_url = COALESCE(?, image_url),
                           category = COALESCE(?, category),
                           sort_order = COALESCE(?, sort_order),
                           status = COALESCE(?, status)
       WHERE id = ?`,
      [
        toNull(name),
        image_url,
        categoryInput !== undefined ? String(categoryInput) : null,
        toNull(sort_order),
        toNull(status),
        req.params.id,
      ],
    );

    if (categoryInput !== undefined) {
      await syncStickerCategories(req.params.id, categoryInput);
    }

    res.json({ message: "Cập nhật sticker thành công" });
  } catch (err) {
    console.error("updateSticker:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ─── ADMIN: SẮP XẾP LẠI THỨ TỰ (kéo-thả trên toàn danh sách) ────
// PUT /api/stickers/reorder
// Body JSON: { ids: [id3, id1, id2] }
const reorderStickers = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length < 2)
      return res.status(400).json({ message: "Danh sách id không hợp lệ" });

    const placeholders = ids.map(() => "?").join(",");
    const [rows] = await db.query(
      `SELECT id, sort_order FROM stickers WHERE id IN (${placeholders})`,
      ids,
    );
    if (rows.length !== ids.length)
      return res.status(400).json({ message: "Có id không tồn tại" });

    const sortedValues = rows.map((r) => r.sort_order).sort((a, b) => a - b);

    await Promise.all(
      ids.map((id, i) =>
        db.execute(`UPDATE stickers SET sort_order = ? WHERE id = ?`, [
          sortedValues[i],
          id,
        ]),
      ),
    );

    res.json({ message: "Đã cập nhật thứ tự" });
  } catch (err) {
    console.error("reorderStickers:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: XÓA VĨNH VIỄN STICKER ──────────────────────────────
// DELETE /api/stickers/:id
const deleteSticker = async (req, res) => {
  try {
    const stickerId = req.params.id;
    // 1. Xóa liên kết danh mục
    await db.execute(`DELETE FROM sticker_category_map WHERE sticker_id = ?`, [
      stickerId,
    ]);
    // 2. Xóa liên kết overlay nếu có
    await db.execute(`DELETE FROM media_sticker_overlays WHERE sticker_id = ?`, [
      stickerId,
    ]);
    // 3. Xóa vĩnh viễn sticker trong DB
    await db.execute(`DELETE FROM stickers WHERE id = ?`, [stickerId]);

    // 4. Dọn dẹp danh mục rảnh rỗi không ai dùng
    try {
      await db.query(`
        DELETE c FROM sticker_categories c
        LEFT JOIN sticker_category_map m ON m.category_id = c.id
        WHERE m.category_id IS NULL AND c.id > 4
      `);
    } catch (e) {}

    res.json({ message: "Đã xóa vĩnh viễn sticker" });
  } catch (err) {
    console.error("deleteSticker:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

module.exports = {
  getAllCategories,
  getAllStickers,
  getAllStickersAdmin,
  createSticker,
  bulkCreateStickers,
  updateSticker,
  reorderStickers,
  deleteSticker,
};
