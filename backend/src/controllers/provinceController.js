const Province = require("../models/Province");
const db = require("../config/db");

// ─── GET ALL PROVINCES ───────────────────────────────────────
// GET /api/provinces
const getAllProvinces = async (req, res) => {
  try {
    const includeInactive = req.query.include_inactive === "true";
    const provinces = await Province.findAll({ includeInactive });
    res.json({ provinces });
  } catch (err) {
    console.error("getAllProvinces:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── GET PROVINCE BY SLUG ────────────────────────────────────
// GET /api/provinces/:slug
const getProvince = async (req, res) => {
  try {
    const province = await Province.findBySlug(req.params.slug);
    if (!province)
      return res.status(404).json({ message: "Không tìm thấy tỉnh thành" });

    // Lấy kèm danh sách địa danh
    const [landmarks] = await db.execute(
      `SELECT id, name, address, latitude, longitude, maps_place_id,
              thumbnail_url, description, category, sort_order
       FROM landmarks
       WHERE province_id = ? AND status = 'active'
       ORDER BY sort_order ASC, id ASC`,
      [province.id],
    );

    // Lấy danh sách quán ăn & món ngon
    const [foods] = await db.execute(
      `SELECT id, title, image_url, address, description, view_count, published_date, is_featured, sort_order
       FROM province_foods
       WHERE province_id = ? AND status = 'active'
       ORDER BY sort_order ASC, id ASC`,
      [province.id],
    );

    // Lấy danh sách cẩm nang & review
    const [articles] = await db.execute(
      `SELECT id, category, title, image_url, description, view_count, published_date, is_featured, sort_order
       FROM province_articles
       WHERE province_id = ? AND status = 'active'
       ORDER BY sort_order ASC, id ASC`,
      [province.id],
    );

    // Lấy danh sách lễ hội
    const [festivals] = await db.execute(
      `SELECT id, title, image_url, event_time, description, sort_order
       FROM province_festivals
       WHERE province_id = ? AND status = 'active'
       ORDER BY sort_order ASC, id ASC`,
      [province.id],
    );

    res.json({ province, landmarks, foods, articles, festivals });
  } catch (err) {
    console.error("getProvince:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: LƯU TOÀN BỘ CẨM NANG VISUAL EDITOR ─────────────────
// PUT /api/provinces/:id/full-guide
const saveFullProvinceGuide = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const provinceId = req.params.id;
    const {
      province: pData,
      landmarks = [],
      foods = [],
      articles = [],
      festivals = [],
    } = req.body;

    if (pData) {
      const allowed = [
        "name",
        "slug",
        "region",
        "description",
        "thumbnail_url",
        "youtube_url",
        "population",
        "area_km2",
        "specialties",
        "lat",
        "lng",
        "status",
      ];
      const keys = Object.keys(pData).filter((k) => allowed.includes(k));
      if (keys.length > 0) {
        const setClause = keys.map((k) => `${k} = ?`).join(", ");
        const values = keys.map((k) => pData[k]);
        await connection.execute(
          `UPDATE provinces SET ${setClause} WHERE id = ?`,
          [...values, provinceId],
        );
      }
    }

    // Sync landmarks if provided
    if (Array.isArray(landmarks)) {
      await connection.execute(
        `DELETE FROM landmarks WHERE province_id = ?`,
        [provinceId],
      );
      for (let i = 0; i < landmarks.length; i++) {
        const l = landmarks[i];
        const name = l.name || l.title;
        if (name) {
          await connection.execute(
            `INSERT INTO landmarks (province_id, name, address, latitude, longitude, maps_place_id, thumbnail_url, description, category, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              provinceId,
              name,
              l.address || null,
              l.latitude || null,
              l.longitude || null,
              l.maps_place_id || null,
              l.thumbnail_url || l.image || null,
              l.description || l.desc || null,
              l.category || "attraction",
              i + 1,
              "active",
            ],
          );
        }
      }
    }

    // Sync foods if provided
    if (Array.isArray(foods)) {
      await connection.execute(
        `DELETE FROM province_foods WHERE province_id = ?`,
        [provinceId],
      );
      for (let i = 0; i < foods.length; i++) {
        const f = foods[i];
        const title = f.title || f.name;
        if (title) {
          await connection.execute(
            `INSERT INTO province_foods (province_id, title, image_url, address, description, view_count, published_date, is_featured, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              provinceId,
              title,
              f.image_url || f.image || null,
              f.address || null,
              f.description || f.desc || null,
              f.view_count || f.views || "100,000+",
              f.published_date || f.date || "01/01/2026",
              f.is_featured ? 1 : 0,
              i + 1,
              "active",
            ],
          );
        }
      }
    }

    // Sync articles if provided
    if (Array.isArray(articles)) {
      await connection.execute(
        `DELETE FROM province_articles WHERE province_id = ?`,
        [provinceId],
      );
      for (let i = 0; i < articles.length; i++) {
        const a = articles[i];
        const title = a.title || a.name;
        if (title) {
          await connection.execute(
            `INSERT INTO province_articles (province_id, category, title, image_url, description, view_count, published_date, is_featured, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              provinceId,
              a.category || "transport",
              title,
              a.image_url || a.image || null,
              a.description || a.desc || null,
              a.view_count || a.views || "50,000+",
              a.published_date || a.date || "01/01/2026",
              a.is_featured ? 1 : 0,
              i + 1,
              "active",
            ],
          );
        }
      }
    }

    // Sync festivals if provided
    if (Array.isArray(festivals)) {
      await connection.execute(
        `DELETE FROM province_festivals WHERE province_id = ?`,
        [provinceId],
      );
      for (let i = 0; i < festivals.length; i++) {
        const fe = festivals[i];
        const title = fe.title || fe.name;
        if (title) {
          await connection.execute(
            `INSERT INTO province_festivals (province_id, title, image_url, event_time, description, sort_order, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              provinceId,
              title,
              fe.image_url || fe.image || null,
              fe.event_time || fe.date || "Hàng năm",
              fe.description || fe.desc || null,
              i + 1,
              "active",
            ],
          );
        }
      }
    }

    await connection.commit();
    res.json({ message: "Lưu cẩm nang tỉnh thành thành công!" });
  } catch (err) {
    await connection.rollback();
    console.error("saveFullProvinceGuide error:", err);
    res.status(500).json({ message: "Lỗi lưu dữ liệu cẩm nang" });
  } finally {
    connection.release();
  }
};

// ─── ADMIN: TẠO TỈNH ─────────────────────────────────────────
// POST /api/provinces
const createProvince = async (req, res) => {
  try {
    const {
      name,
      slug,
      region,
      description,
      thumbnail_url,
      youtube_url,
      population,
      area_km2,
      specialties,
      lat,
      lng,
    } = req.body;

    if (!name || !slug || !region)
      return res.status(400).json({ message: "Thiếu name, slug hoặc region" });

    const id = await Province.create({
      name,
      slug,
      region,
      description,
      thumbnail_url,
      youtube_url,
      population,
      area_km2,
      specialties,
      lat,
      lng,
    });

    const province = await Province.findById(id);
    res.status(201).json({ message: "Tạo tỉnh thành công", province });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ message: "Slug đã tồn tại" });
    console.error("createProvince:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: CẬP NHẬT TỈNH ────────────────────────────────────
// PUT /api/provinces/:id
const updateProvince = async (req, res) => {
  try {
    await Province.update(req.params.id, req.body);
    const province = await Province.findById(req.params.id);
    res.json({ message: "Cập nhật thành công", province });
  } catch (err) {
    console.error("updateProvince:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: XÓA MỀM TỈNH ─────────────────────────────────────
// DELETE /api/provinces/:id
const deleteProvince = async (req, res) => {
  try {
    await Province.deactivate(req.params.id);
    res.json({ message: "Đã ẩn tỉnh thành" });
  } catch (err) {
    console.error("deleteProvince:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── ADMIN: UPLOAD FILE LÊN CLOUDINARY ───────────────────────
// POST /api/provinces/upload
const { uploadSingle, runMiddleware } = require("../middleware/upload");
const { uploadWithFallback } = require("../utils/fileStorage");

const uploadFile = async (req, res) => {
  try {
    await runMiddleware(req, res, uploadSingle);
    if (!req.file)
      return res.status(400).json({ message: "Không tìm thấy file" });

    const result = await uploadWithFallback({
      buffer: req.file.buffer,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      subfolder: "provinces",
      cloudinaryOptions: {
        folder: "vinatap/uploads",
        resource_type: "auto",
      },
    });

    res.json({ message: "Upload file thành công", url: result.secure_url });
  } catch (err) {
    console.error("uploadFile error:", err);
    res.status(500).json({ message: err.message || "Lỗi upload file" });
  }
};

// ─── GET TTS AUDIO STREAM (PROXY) ─────────────────────────────
// GET /api/provinces/tts?text=...
const getTts = async (req, res) => {
  try {
    const rawText = String(req.query.text || "").trim();
    if (!rawText) return res.status(400).send("Missing text parameter");

    // Giới hạn độ dài tối đa 500 ký tự (chống spam quá tải Google TTS)
    const text = rawText.slice(0, 500);

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      text,
    )}&tl=vi&client=tw-ob`;

    const fetchRes = await fetch(ttsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!fetchRes.ok) {
      return res.status(500).send("TTS Service Error");
    }

    const arrayBuffer = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": buffer.length,
      "Cache-Control": "public, max-age=86400",
      "Cross-Origin-Resource-Policy": "cross-origin",
    });
    res.send(buffer);
  } catch (err) {
    console.error("getTts error:", err);
    res.status(500).send(err.message);
  }
};

module.exports = {
  getAllProvinces,
  getProvince,
  saveFullProvinceGuide,
  createProvince,
  updateProvince,
  deleteProvince,
  uploadFile,
  getTts,
};
