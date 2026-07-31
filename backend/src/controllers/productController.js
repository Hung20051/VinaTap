const Product = require("../models/Product");

// GET /api/products?includeInactive=1
const getAllProducts = async (req, res) => {
  try {
    const includeInactive = req.query.includeInactive === "1";
    const products = await Product.findAll(includeInactive);
    res.json({ products });
  } catch (err) {
    console.error("getAllProducts:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, default_price } = req.body;
    if (!name || default_price === undefined)
      return res.status(400).json({ message: "Thiếu name hoặc default_price" });
    if (Number(default_price) < 0)
      return res.status(400).json({ message: "Giá không được âm" });

    const id = await Product.create({ name, default_price });
    res.status(201).json({ message: "Đã tạo sản phẩm", id });
  } catch (err) {
    console.error("createProduct:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { name, default_price } = req.body;
    if (!name || default_price === undefined)
      return res.status(400).json({ message: "Thiếu name hoặc default_price" });

    const existing = await Product.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    await Product.update(req.params.id, { name, default_price });
    res.json({ message: "Đã cập nhật sản phẩm" });
  } catch (err) {
    console.error("updateProduct:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PATCH /api/products/:id/active  Body: { is_active: boolean }
// Ẩn/hiện — không xóa thật, vì manual_sales cũ có thể vẫn tham chiếu tới
// sản phẩm này (product_name_snapshot đã lưu sẵn nên không sao, nhưng vẫn
// giữ được để bấm vào xem chi tiết sản phẩm gốc nếu cần).
const setProductActive = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    await Product.setActive(req.params.id, !!req.body.is_active);
    res.json({ message: "Đã cập nhật trạng thái" });
  } catch (err) {
    console.error("setProductActive:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  setProductActive,
};
