const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  createProduct,
  updateProduct,
  setProductActive,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

// Toàn bộ route sản phẩm chỉ admin mới thấy — khách hàng không cần biết
// giá vốn/danh sách sản phẩm bán sỉ cho đại lý.
router.use(protect, requireRole("admin"));

router.get("/", getAllProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.patch("/:id/active", setProductActive);

module.exports = router;
