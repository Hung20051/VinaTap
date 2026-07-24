const express = require("express");
const router = express.Router();

const {
  createSession,
  sendMessage,
  getSession,
  getMySessions,
  closeSession,
} = require("../controllers/chatbotController");
const { protect } = require("../middleware/auth");
const { chatMessageLimiter } = require("../middleware/rateLimit");

// Tất cả chatbot đều cần đăng nhập
router.get("/sessions", protect, getMySessions);
router.post("/sessions", protect, createSession);
router.get("/sessions/:sessionId", protect, getSession);
router.post(
  "/sessions/:sessionId/messages",
  protect,
  chatMessageLimiter,
  sendMessage,
);
router.delete("/sessions/:sessionId", protect, closeSession);

module.exports = router;
