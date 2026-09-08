const express = require("express");
const router = express.Router();
const { protect, requireAdmin, optionalAuth } = require("../middleware/auth");
const { orderCheckLimiter, orderCreateLimiter } = require("../middleware/rateLimit");
const {
  createOrder,
  getMyOrders,
  getMyOrderDetail,
  getAdminOrders,
  getAdminOrderDetail,
  updateOrderStatus,
  customerCancelOrder,
  customerRequestCancel,
  adminReviewCancelRequest,
  checkOrderStatus,
  paymentWebhook,
} = require("../controllers/orderController");

// Public & Webhook Routes
router.get("/check-status/:orderCode", optionalAuth, orderCheckLimiter, checkOrderStatus);
router.post("/payment-webhook", paymentWebhook);

// Customer Routes (Yêu cầu đăng nhập)
router.post("/", protect, orderCreateLimiter, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/my/:id", protect, getMyOrderDetail);
router.post("/my/:id/cancel", protect, customerCancelOrder);
router.post("/my/:id/cancel-request", protect, customerRequestCancel);

// Admin Routes (Yêu cầu quyền Admin)
router.get("/admin/all", protect, requireAdmin, getAdminOrders);
router.get("/admin/:id", protect, requireAdmin, getAdminOrderDetail);
router.patch("/admin/:id/status", protect, requireAdmin, updateOrderStatus);
router.patch("/admin/:id/cancel-request", protect, requireAdmin, adminReviewCancelRequest);

module.exports = router;
