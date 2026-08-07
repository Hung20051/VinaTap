const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/auth");
const {
  createOrder,
  getMyOrders,
  getAdminOrders,
  updateOrderStatus,
  checkOrderStatus,
  paymentWebhook,
} = require("../controllers/orderController");

// Public & Webhook Routes
router.get("/check-status/:orderCode", checkOrderStatus);
router.post("/payment-webhook", paymentWebhook);

// Customer Routes (Yêu cầu đăng nhập)
router.post("/", protect, createOrder);
router.get("/my", protect, getMyOrders);

// Admin Routes (Yêu cầu quyền Admin)
router.get("/admin/all", protect, requireAdmin, getAdminOrders);
router.patch("/admin/:id/status", protect, requireAdmin, updateOrderStatus);

module.exports = router;
