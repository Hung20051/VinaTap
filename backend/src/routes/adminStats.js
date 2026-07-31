const express = require("express");
const router = express.Router();

const { getOverview } = require("../controllers/adminStatsController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

router.use(protect, requireRole("admin"));

router.get("/overview", getOverview);

module.exports = router;
