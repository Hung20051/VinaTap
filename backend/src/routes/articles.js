const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const { protect, optionalAuth } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

const { uploadSingle, runMiddleware } = require("../middleware/upload");
const { uploadWithFallback } = require("../utils/fileStorage");

// Public endpoints (optionalAuth allows admin to view drafts/all articles)
router.get("/", optionalAuth, getAllArticles);
router.get("/:slug", optionalAuth, getArticleBySlug);

// Admin-only endpoints
router.post("/upload", protect, requireRole("admin"), async (req, res) => {
  try {
    await runMiddleware(req, res, uploadSingle);
    if (!req.file) return res.status(400).json({ message: "Không tìm thấy file" });

    const result = await uploadWithFallback({
      buffer: req.file.buffer,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      subfolder: "articles",
      cloudinaryOptions: {
        folder: "vinatap/articles",
        resource_type: "auto",
      },
    });

    res.json({ message: "Upload file thành công", url: result.secure_url });
  } catch (err) {
    console.error("upload article image error:", err);
    res.status(500).json({ message: err.message || "Lỗi tải ảnh" });
  }
});

router.post("/", protect, requireRole("admin"), createArticle);
router.put("/:id", protect, requireRole("admin"), updateArticle);
router.delete("/:id", protect, requireRole("admin"), deleteArticle);

module.exports = router;

