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
    const { name, category, price, original_price, image, tag, description } = req.body;
    if (!name || price === undefined)
      return res.status(400).json({ message: "Thiếu name hoặc price" });
    if (Number(price) < 0)
      return res.status(400).json({ message: "Giá không được âm" });

    const id = await Product.create({
      name,
      category: category || "single",
      price: Number(price),
      original_price: Number(original_price || 0),
      image: image || "",
      tag: tag || "",
      description: description || "",
    });
    res.status(201).json({ message: "Đã tạo sản phẩm thành công!", id });
  } catch (err) {
    console.error("createProduct:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const { name, category, price, original_price, image, tag, description } = req.body;
    await Product.update(req.params.id, {
      name: name || existing.name,
      category: category || existing.category || "single",
      price: price !== undefined ? Number(price) : existing.price,
      original_price: original_price !== undefined ? Number(original_price) : existing.original_price,
      image: image !== undefined ? image : existing.image,
      tag: tag !== undefined ? tag : existing.tag,
      description: description !== undefined ? description : existing.description,
    });
    res.json({ message: "Đã cập nhật sản phẩm thành công!" });
  } catch (err) {
    console.error("updateProduct:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// PATCH /api/products/:id/active
const setProductActive = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    await Product.setActive(req.params.id, !!req.body.is_active);
    res.json({ message: "Đã cập nhật trạng thái sản phẩm" });
  } catch (err) {
    console.error("setProductActive:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    await Product.delete(req.params.id);
    res.json({ message: "Đã xóa sản phẩm thành công!" });
  } catch (err) {
    console.error("deleteProduct:", err);
    res.status(500).json({ message: "Lỗi server khi xóa sản phẩm" });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  setProductActive,
  deleteProduct,
};
