const db = require("../config/db");

// ─── THÊM ĐỊA DANH ───────────────────────────────────────────
// POST /api/provinces/:id/landmarks
const createLandmark = async (req, res) => {
  try {
    const province_id = req.params.id;
    const {
      name,
      address,
      latitude,
      longitude,
      maps_place_id,
      thumbnail_url,
      description,
      category,
    } = req.body;

    if (!name) return res.status(400).json({ message: "Thiếu tên địa danh" });

    // Kiểm tra tỉnh tồn tại
    const [provinces] = await db.execute(
      `SELECT id FROM provinces WHERE id = ? AND status = 'active'`,
      [province_id],
    );
    if (!provinces.length)
      return res.status(404).json({ message: "Không tìm thấy tỉnh thành" });

    const [result] = await db.execute(
      `INSERT INTO landmarks
         (province_id, name, address, latitude, longitude, maps_place_id,
          thumbnail_url, description, category, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
        province_id,
        name,
        address || null,
        latitude || null,
        longitude || null,
        maps_place_id || null,
        thumbnail_url || null,
        description || null,
        category || "attraction",
      ],
    );

    res.status(201).json({
      message: "Thêm địa danh thành công",
      landmark: { id: result.insertId, province_id, name, category },
    });
  } catch (err) {
    console.error("createLandmark:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── SỬA ĐỊA DANH ────────────────────────────────────────────
// PUT /api/provinces/landmarks/:landmarkId
const updateLandmark = async (req, res) => {
  try {
    const allowed = [
      "name",
      "address",
      "latitude",
      "longitude",
      "maps_place_id",
      "thumbnail_url",
      "description",
      "category",
      "status",
    ];
    const keys = Object.keys(req.body).filter((k) => allowed.includes(k));

    if (!keys.length)
      return res
        .status(400)
        .json({ message: "Không có trường nào hợp lệ để cập nhật" });

    const setClause = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => req.body[k]);

    const [result] = await db.execute(
      `UPDATE landmarks SET ${setClause} WHERE id = ?`,
      [...values, req.params.landmarkId],
    );

    if (!result.affectedRows)
      return res.status(404).json({ message: "Không tìm thấy địa danh" });

    res.json({ message: "Cập nhật địa danh thành công" });
  } catch (err) {
    console.error("updateLandmark:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ─── XÓA MỀM ĐỊA DANH ───────────────────────────────────────
// DELETE /api/provinces/landmarks/:landmarkId
const deleteLandmark = async (req, res) => {
  try {
    const [result] = await db.execute(
      `UPDATE landmarks SET status = 'inactive' WHERE id = ?`,
      [req.params.landmarkId],
    );

    if (!result.affectedRows)
      return res.status(404).json({ message: "Không tìm thấy địa danh" });

    res.json({ message: "Đã ẩn địa danh" });
  } catch (err) {
    console.error("deleteLandmark:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { createLandmark, updateLandmark, deleteLandmark };
