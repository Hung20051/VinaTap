const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  getAllStickers,
  getAllStickersAdmin,
  createSticker,
  bulkCreateStickers,
  updateSticker,
  reorderStickers,
  deleteSticker,
} = require("../controllers/stickerController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

// Guest + customer xem được (chỉ sticker 'active')
router.get("/categories", getAllCategories);
router.get("/", getAllStickers);

// Chỉ admin
router.get("/admin", protect, requireRole("admin"), getAllStickersAdmin);
router.post("/", protect, requireRole("admin"), createSticker);
router.post("/bulk", protect, requireRole("admin"), bulkCreateStickers);
// ⚠️ "/reorder" PHẢI đứng TRƯỚC "/:id" — nếu để "/:id" trước, Express sẽ
// khớp "/reorder" thành id="reorder" (chuỗi, không phải số) và không
// bao giờ chạm được vào route thật bên dưới.
router.put("/reorder", protect, requireRole("admin"), reorderStickers);
router.put("/:id", protect, requireRole("admin"), updateSticker);
router.delete("/:id", protect, requireRole("admin"), deleteSticker);

module.exports = router;
