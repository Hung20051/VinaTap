const db = require("../config/db");

const ShippingRule = {
  async initTable() {
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS shipping_rules (
          id INT AUTO_INCREMENT PRIMARY KEY,
          rule_name VARCHAR(100) DEFAULT 'Mặc định',
          base_fee DECIMAL(12,2) NOT NULL DEFAULT 30000,
          free_shipping_threshold DECIMAL(12,2) NOT NULL DEFAULT 500000,
          is_active TINYINT(1) DEFAULT 1,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);

      const [rows] = await db.execute(`SELECT COUNT(*) AS count FROM shipping_rules`);
      if (rows[0] && rows[0].count === 0) {
        await db.execute(
          `INSERT INTO shipping_rules (rule_name, base_fee, free_shipping_threshold, is_active) VALUES ('Giao hàng toàn quốc', 30000, 500000, 1)`
        );
      }
    } catch (err) {
      console.error("ShippingRule initTable error:", err.message);
    }
  },

  async getRule() {
    await this.initTable();
    const [rows] = await db.execute(`SELECT * FROM shipping_rules WHERE is_active = 1 LIMIT 1`);
    return rows[0] || { base_fee: 30000, free_shipping_threshold: 500000 };
  },

  async updateRule({ base_fee, free_shipping_threshold }) {
    await this.initTable();
    const [rows] = await db.execute(`SELECT id FROM shipping_rules LIMIT 1`);
    if (rows.length > 0) {
      await db.execute(
        `UPDATE shipping_rules SET base_fee = ?, free_shipping_threshold = ? WHERE id = ?`,
        [base_fee, free_shipping_threshold, rows[0].id]
      );
    } else {
      await db.execute(
        `INSERT INTO shipping_rules (rule_name, base_fee, free_shipping_threshold, is_active) VALUES ('Giao hàng toàn quốc', ?, ?, 1)`,
        [base_fee, free_shipping_threshold]
      );
    }
  }
};

module.exports = ShippingRule;
