const express = require("express");
const router = express.Router();

const {
  tapCard,
  claimCard,
  activateSerial,
  getMyCards,
  getPendingTransfers,
  rejectTransfer,
  initiateTransfer,
  acceptTransfer,
  cancelTransfer,
  createBatch,
  adminSearchCards,
  adminAssignCard,
  provisionCard,
  getCardsByProvince,
} = require("../controllers/nfcController");

const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const { activateLimiter } = require("../middleware/rateLimit");

// ── PUBLIC: chạm NFC → lấy thông tin thẻ ───────────────────
router.get("/t/:token", tapCard);

// ── CUSTOMER: claim + activate ───────────────────────────────
router.post("/t/:token/claim", protect, claimCard);
router.post("/activate", activateLimiter, protect, activateSerial); // dự phòng chip hỏng
router.get("/my-cards", protect, getMyCards);

// ── CUSTOMER: chuyển nhượng (Tặng & Nhận quà) ───────────────────
router.get("/transfers/pending", protect, getPendingTransfers); // lấy danh sách quà tặng đang chờ
router.post("/transfers/reject", protect, rejectTransfer); // người nhận từ chối
router.post("/transfer/accept", protect, acceptTransfer); // người nhận xác nhận (qua token hoặc transfer_id)
router.post("/:id/transfer", protect, initiateTransfer); // gửi lời mời
router.delete("/:id/transfer", protect, cancelTransfer); // người gửi hủy

// ── ADMIN ────────────────────────────────────────────────────
router.get("/admin/search", protect, requireRole("admin"), adminSearchCards);
router.post("/admin/assign", protect, requireRole("admin"), adminAssignCard);
router.post("/admin/provision", protect, requireRole("admin"), provisionCard);
router.post("/batch", protect, requireRole("admin"), createBatch);
router.get(
  "/province/:provinceId",
  protect,
  requireRole("admin"),
  getCardsByProvince,
);

module.exports = router;
