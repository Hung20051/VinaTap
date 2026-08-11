const express = require("express");
const router = express.Router();

const {
  getAllProvinces,
  getProvince,
  createProvince,
  updateProvince,
  deleteProvince,
  uploadFile,
  getTts,
} = require("../controllers/provinceController");

const {
  createLandmark,
  updateLandmark,
  deleteLandmark,
} = require("../controllers/landmarkController");

const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");
const { ttsLimiter } = require("../middleware/rateLimit");

// Upload file ảnh/video từ máy tính lên Cloudinary
router.post("/upload", protect, requireRole("admin"), uploadFile);

// Guest xem được
router.get("/tts/stream", ttsLimiter, getTts);
router.get("/", getAllProvinces);
router.get("/:slug", getProvince);

// Chỉ admin
router.post("/", protect, requireRole("admin"), createProvince);
router.put("/:id", protect, requireRole("admin"), updateProvince);
router.delete("/:id", protect, requireRole("admin"), deleteProvince);

// Landmark
router.post("/:id/landmarks", protect, requireRole("admin"), createLandmark);
router.put(
  "/landmarks/:landmarkId",
  protect,
  requireRole("admin"),
  updateLandmark,
);
router.delete(
  "/landmarks/:landmarkId",
  protect,
  requireRole("admin"),
  deleteLandmark,
);

module.exports = router;
