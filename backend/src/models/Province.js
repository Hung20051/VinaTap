const db = require("../config/db");

const Province = {
  // Lấy tất cả tỉnh (guest xem được)
  async findAll() {
    const [rows] = await db.execute(
      `SELECT id, name, slug, region, description, thumbnail_url, youtube_url,
              population, area_km2, specialties, lat, lng
       FROM provinces WHERE status = 'active' ORDER BY name ASC`,
    );
    return rows;
  },

  // Lấy 1 tỉnh theo slug
  async findBySlug(slug) {
    const [rows] = await db.execute(
      `SELECT * FROM provinces WHERE slug = ? AND status = 'active' LIMIT 1`,
      [slug],
    );
    return rows[0] || null;
  },

  // Lấy 1 tỉnh theo id
  async findById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM provinces WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] || null;
  },

  // Admin: tạo tỉnh mới
  async create({
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
  }) {
    const [result] = await db.execute(
      `INSERT INTO provinces
         (name, slug, region, description, thumbnail_url, youtube_url,
          population, area_km2, specialties, lat, lng, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [
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
      ],
    );
    return result.insertId;
  },

  // Admin: cập nhật tỉnh
  async update(id, fields) {
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
    const keys = Object.keys(fields).filter((k) => allowed.includes(k));
    if (!keys.length) return;
    const setClause = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => fields[k]);
    await db.execute(`UPDATE provinces SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ]);
  },

  // Admin: xóa mềm
  async deactivate(id) {
    await db.execute(`UPDATE provinces SET status = 'inactive' WHERE id = ?`, [
      id,
    ]);
  },
};

module.exports = Province;
