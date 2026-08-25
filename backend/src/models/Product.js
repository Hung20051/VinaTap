const db = require("../config/db");

const Product = {
  // Lấy tất cả sản phẩm — mặc định chỉ lấy is_active=1 (cho dropdown tạo
  // đơn mới), truyền includeInactive=true để lấy hết
  async findAll(includeInactive = false) {
    const where = includeInactive ? "" : "WHERE is_active = 1";
    const [rows] = await db.execute(
      `SELECT id, name, category, price, original_price, image, tag, description, is_active, created_at
       FROM products ${where}
       ORDER BY id ASC`,
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM products WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] || null;
  },

  async create({
    name,
    category,
    price,
    original_price,
    image,
    tag,
    description,
  }) {
    const [result] = await db.execute(
      `INSERT INTO products (name, category, price, original_price, image, tag, description, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        name,
        category || "single",
        price || 0,
        original_price || 0,
        image || "",
        tag || "",
        description || "",
      ],
    );
    return result.insertId;
  },

  async update(
    id,
    { name, category, price, original_price, image, tag, description },
  ) {
    await db.execute(
      `UPDATE products SET name = ?, category = ?, price = ?, original_price = ?, image = ?, tag = ?, description = ? WHERE id = ?`,
      [name, category, price, original_price, image, tag, description, id],
    );
  },

  async setActive(id, isActive) {
    await db.execute(`UPDATE products SET is_active = ? WHERE id = ?`, [
      isActive ? 1 : 0,
      id,
    ]);
  },

  async delete(id) {
    await db.execute(`DELETE FROM products WHERE id = ?`, [id]);
  },
};

module.exports = Product;
