const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/auth");
const {
  getMyWallet,
  redeemCode,
  getAllVouchers,
  createVoucher,
  sendVoucherToUsers,
  deleteVoucher,
} = require("../controllers/voucherController");

// Customer routes
router.get("/my-wallet", protect, getMyWallet);
router.post("/redeem", protect, redeemCode);

// Admin routes
router.get("/", protect, requireAdmin, getAllVouchers);
router.post("/", protect, requireAdmin, createVoucher);
router.post("/send", protect, requireAdmin, sendVoucherToUsers);
router.delete("/:id", protect, requireAdmin, deleteVoucher);

module.exports = router;
