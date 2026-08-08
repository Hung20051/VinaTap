const express = require("express");
const router = express.Router();
const {
  getShippingRule,
  updateShippingRule,
} = require("../controllers/shippingController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

// Public cho cửa hàng xem phí ship
router.get("/public", getShippingRule);

// Admin xem & cập nhật phí ship
router.get("/", protect, requireRole("admin"), getShippingRule);
router.put("/", protect, requireRole("admin"), updateShippingRule);

module.exports = router;
