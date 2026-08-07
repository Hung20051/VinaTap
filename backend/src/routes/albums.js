const express = require("express");
const router = express.Router();

const {
  createAlbum,
  getAlbum,
  getMyAlbums,
  updateAlbum,
  deleteAlbum,
  createTag,
  deleteTag,
  getAdminStats,
  getAdminList,
  updateAdminStatus,
} = require("../controllers/albumController");
const {
  requestEdit,
  reviewRequest,
  revokeAccess,
  getCollaborators,
} = require("../controllers/shareController");
const { protect, requireAdmin } = require("../middleware/auth");
const { optionalAuth } = require("../middleware/auth");

// Admin Routes (Privacy-First Metadata)
router.get("/admin/stats", protect, requireAdmin, getAdminStats);
router.get("/admin/list", protect, requireAdmin, getAdminList);
router.patch("/admin/:id/status", protect, requireAdmin, updateAdminStatus);

// Albums
router.post("/", protect, createAlbum);
router.get("/my", protect, getMyAlbums);
router.get("/:id", optionalAuth, getAlbum); // guest xem được nếu public
router.put("/:id", protect, updateAlbum);
router.delete("/:id", protect, deleteAlbum);

// Tags
router.post("/:id/tags", protect, createTag);
router.delete("/:id/tags/:tagId", protect, deleteTag);

// Share / cộng tác
router.post("/:id/share/request", protect, requestEdit);
router.get("/:id/share", protect, getCollaborators);
router.put("/:id/share/:shareId", protect, reviewRequest);
router.delete("/:id/share/:shareId", protect, revokeAccess);

module.exports = router;
