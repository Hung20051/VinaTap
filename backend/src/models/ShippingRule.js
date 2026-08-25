const db = require("../config/db");

const ShippingRule = {
  async getRule() {
    const [rows] = await db.execute(`SELECT * FROM shipping_rules WHERE is_active = 1 LIMIT 1`);
    return rows[0] || { base_fee: 30000, free_shipping_threshold: 500000 };
  },

  async updateRule({ base_fee, free_shipping_threshold }) {
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
