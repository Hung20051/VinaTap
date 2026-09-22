const express = require("express");
const router = express.Router();

const {
  uploadMedia,
  uploadMultipleMedia,
  updateMedia,
  deleteMedia,
  addStickerOverlay,
  updateStickerOverlay,
  deleteStickerOverlay,
  saveMediaStickers,
  reorderMedia,
} = require("../controllers/mediaController");

const { protect } = require("../middleware/auth");

// Sắp xếp thứ tự ảnh/video (Drag & Drop) — phải đặt trước /:id
router.put("/reorder", protect, reorderMedia);

// Upload
router.post("/upload", protect, uploadMedia);
router.post("/upload-multiple", protect, uploadMultipleMedia);

// Sticker overlay lên ảnh — lưu toàn bộ
router.put("/:id/stickers", protect, saveMediaStickers);

// Sửa / xóa media
router.put("/:id", protect, updateMedia);
router.delete("/:id", protect, deleteMedia);

// Sticker overlay lên ảnh
router.post("/:id/stickers", protect, addStickerOverlay);
router.put("/stickers/:overlayId", protect, updateStickerOverlay);
router.delete("/stickers/:overlayId", protect, deleteStickerOverlay);

module.exports = router;
