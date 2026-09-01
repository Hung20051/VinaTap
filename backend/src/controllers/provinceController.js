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
              thumbnail_url, description, category
       FROM landmarks
       WHERE province_id = ?
       ORDER BY category, name`,
      [province.id],
    );

    res.json({ province, landmarks });
  } catch (err) {
    console.error("getProvince:", err);
    res.status(500).json({ message: "Lỗi server" });
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
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (buffer, folder = "vinatap/provinces") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });

const uploadFile = async (req, res) => {
  try {
    await runMiddleware(req, res, uploadSingle);
    if (!req.file)
      return res.status(400).json({ message: "Không tìm thấy file" });

    const result = await uploadToCloudinary(req.file.buffer, "vinatap/uploads");
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
  createProvince,
  updateProvince,
  deleteProvince,
  uploadFile,
  getTts,
};
