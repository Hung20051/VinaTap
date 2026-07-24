const Province = require("../models/Province");
const db = require("../config/db");

// ─── GET ALL PROVINCES ───────────────────────────────────────
// GET /api/provinces
const getAllProvinces = async (req, res) => {
  try {
    const provinces = await Province.findAll();
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
       WHERE province_id = ? AND status = 'active'
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

module.exports = {
  getAllProvinces,
  getProvince,
  createProvince,
  updateProvince,
  deleteProvince,
};
