const db = require("../config/db");

const Product = {
  // Lấy tất cả sản phẩm — mặc định chỉ lấy is_active=1 (cho dropdown tạo
  // đơn mới), truyền includeInactive=true để lấy hết (màn hình quản lý
  // sản phẩm cần thấy cả sản phẩm đã ẩn để bật lại được).
  async findAll(includeInactive = false) {
    const where = includeInactive ? "" : "WHERE is_active = 1";
    const [rows] = await db.execute(
      `SELECT id, name, default_price, is_active, created_at
       FROM products ${where}
       ORDER BY name ASC`,
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

  async create({ name, default_price }) {
    const [result] = await db.execute(
      `INSERT INTO products (name, default_price, is_active) VALUES (?, ?, 1)`,
      [name, default_price],
    );
    return result.insertId;
  },

  async update(id, { name, default_price }) {
    await db.execute(
      `UPDATE products SET name = ?, default_price = ? WHERE id = ?`,
      [name, default_price, id],
    );
  },

  // Ẩn/hiện — KHÔNG xóa thật, vì manual_sales.product_id vẫn có thể còn
  // trỏ tới sản phẩm này (giữ lịch sử đơn cũ đúng, dù sản phẩm đã ngừng bán)
  async setActive(id, isActive) {
    await db.execute(`UPDATE products SET is_active = ? WHERE id = ?`, [
      isActive ? 1 : 0,
      id,
    ]);
  },
};

module.exports = Product;
