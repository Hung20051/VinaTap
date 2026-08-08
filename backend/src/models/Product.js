const db = require("../config/db");

const Product = {
  // Khởi tạo bảng products
  async initTable() {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category VARCHAR(50) DEFAULT 'single',
          price DECIMAL(12,2) NOT NULL DEFAULT 0,
          original_price DECIMAL(12,2) DEFAULT 0,
          image TEXT,
          tag VARCHAR(100),
          description TEXT,
          is_active TINYINT(1) NOT NULL DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    } catch (err) {
      console.error("Product initTable error:", err.message);
    }
  },

  // Lấy tất cả sản phẩm — mặc định chỉ lấy is_active=1 (cho dropdown tạo
  // đơn mới), truyền includeInactive=true để lấy hết
  async findAll(includeInactive = false) {
    await this.initTable();
    const where = includeInactive ? "" : "WHERE is_active = 1";
    const [rows] = await db.execute(
      `SELECT id, name, category, price, original_price, image, tag, description, is_active, created_at
       FROM products ${where}
       ORDER BY id ASC`,
    );
    return rows;
  },

  async findById(id) {
    await this.initTable();
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
    await this.initTable();
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
    await this.initTable();
    await db.execute(
      `UPDATE products SET name = ?, category = ?, price = ?, original_price = ?, image = ?, tag = ?, description = ? WHERE id = ?`,
      [name, category, price, original_price, image, tag, description, id],
    );
  },

  async setActive(id, isActive) {
    await this.initTable();
    await db.execute(`UPDATE products SET is_active = ? WHERE id = ?`, [
      isActive ? 1 : 0,
      id,
    ]);
  },

  async delete(id) {
    await this.initTable();
    await db.execute(`DELETE FROM products WHERE id = ?`, [id]);
  },
};

module.exports = Product;
