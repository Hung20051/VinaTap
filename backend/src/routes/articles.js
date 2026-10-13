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

// Public endpoints (optionalAuth allows admin to view drafts/all articles)
router.get("/", optionalAuth, getAllArticles);
router.get("/:slug", optionalAuth, getArticleBySlug);

// Admin-only endpoints
router.post("/", protect, requireRole("admin"), createArticle);
router.put("/:id", protect, requireRole("admin"), updateArticle);
router.delete("/:id", protect, requireRole("admin"), deleteArticle);

module.exports = router;
