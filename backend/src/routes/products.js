const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  createProduct,
  updateProduct,
  setProductActive,
  deleteProduct,
  syncStandardPrices,
} = require("../controllers/productController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

// Public route cho trang Shop lấy giá sản phẩm chuẩn từ Database
router.get("/public", getAllProducts);

// Các route bên dưới yêu cầu quyền Admin
router.use(protect, requireRole("admin"));

router.get("/", getAllProducts);
router.post("/sync-standard-prices", syncStandardPrices);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.patch("/:id/active", setProductActive);
router.delete("/:id", deleteProduct);

module.exports = router;

