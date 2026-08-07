const db = require("../config/db");

const Product = {
  // Tự động khởi tạo bảng products & tự điền 4 sản phẩm mẫu nếu bảng trống
  async initTable() {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          default_price DECIMAL(12,2) NOT NULL DEFAULT 0,
          is_active TINYINT(1) NOT NULL DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      const [rows] = await db.execute(`SELECT COUNT(*) AS count FROM products`);
      if (rows[0] && rows[0].count === 0) {
        const defaultProducts = [
          ["Mảnh Ghép NFC Gỗ 3D — Tùy Chọn Tỉnh Thành", 180000],
          ["Combo Trọn Bộ 34 Tỉnh Thành Việt Nam (Bản Đồ Bản Quyền)", 4500000],
          ["Thẻ NFC Kim Loại VinaTap VIP Edition", 350000],
          ["Sticker NFC Dán Điện Thoại / Xe Máy", 50000],
        ];
        for (const [name, price] of defaultProducts) {
          await db.execute(
            `INSERT INTO products (name, default_price, is_active) VALUES (?, ?, 1)`,
            [name, price],
          );
        }
      }
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
