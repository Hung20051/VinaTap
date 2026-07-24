const express = require("express");
const router = express.Router();

const {
  getAllStickers,
  createSticker,
  updateSticker,
  deleteSticker,
} = require("../controllers/stickerController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

// Guest + customer xem được
router.get("/", getAllStickers);

// Chỉ admin
router.post("/", protect, requireRole("admin"), createSticker);
router.put("/:id", protect, requireRole("admin"), updateSticker);
router.delete("/:id", protect, requireRole("admin"), deleteSticker);

module.exports = router;
