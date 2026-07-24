const express = require("express");
const router = express.Router();

const {
  getAllProvinces,
  getProvince,
  createProvince,
  updateProvince,
  deleteProvince,
} = require("../controllers/provinceController");

// Landmark CRUD sống ở file riêng (landmarkController.js) — giữ tách biệt
// khỏi provinceController để dễ mở rộng sau này (vd thêm review/rating
// cho landmark) mà không phình to provinceController.
const {
  createLandmark,
  updateLandmark,
  deleteLandmark,
} = require("../controllers/landmarkController");

const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

// Guest xem được
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
