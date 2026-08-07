const express = require("express");
const router = express.Router();
const {
  sendNotification,
  getMyNotifications,
  markAsRead,
  getAdminSentHistory,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect, requireAdmin } = require("../middleware/auth");

// Customer routes
router.get("/my", protect, getMyNotifications);
router.post("/read", protect, markAsRead);

// Admin routes
router.post("/admin/send", protect, requireAdmin, sendNotification);
router.get("/admin/sent", protect, requireAdmin, getAdminSentHistory);
router.delete("/admin/:id", protect, requireAdmin, deleteNotification);

module.exports = router;
