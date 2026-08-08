const ShippingRule = require("../models/ShippingRule");

// GET /api/shipping
const getShippingRule = async (req, res) => {
  try {
    const rule = await ShippingRule.getRule();
    res.json({ rule });
  } catch (err) {
    console.error("getShippingRule error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PUT /api/shipping
const updateShippingRule = async (req, res) => {
  try {
    const { base_fee, free_shipping_threshold } = req.body;
    if (base_fee === undefined || free_shipping_threshold === undefined) {
      return res.status(400).json({ message: "Thiếu tham số phí ship" });
    }
    await ShippingRule.updateRule({
      base_fee: Number(base_fee),
      free_shipping_threshold: Number(free_shipping_threshold),
    });
    const rule = await ShippingRule.getRule();
    res.json({ message: "Đã cập nhật phí vận chuyển thành công!", rule });
  } catch (err) {
    console.error("updateShippingRule error:", err);
    res.status(500).json({ message: "Lỗi server khi cập nhật phí ship" });
  }
};

module.exports = {
  getShippingRule,
  updateShippingRule,
};
