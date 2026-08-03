const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  setUserStatus,
  setUserRole,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

router.use(protect, requireRole("admin"));

router.get("/", getAllUsers);
router.patch("/:id/status", setUserStatus);
router.patch("/:id/role", setUserRole);

module.exports = router;
