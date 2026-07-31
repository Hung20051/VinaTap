const express = require("express");
const router = express.Router();

const {
  getAllSales,
  createSale,
  updateSale,
  deleteSale,
  getSummary,
  getDailyRevenue,
  exportCsv,
} = require("../controllers/manualSaleController");
const { protect } = require("../middleware/auth");
const { requireRole } = require("../middleware/role");

router.use(protect, requireRole("admin"));

// Đặt trước "/:id" để không bị nuốt mất bởi route động phía dưới
router.get("/summary", getSummary);
router.get("/daily-revenue", getDailyRevenue);
router.get("/export", exportCsv);

router.get("/", getAllSales);
router.post("/", createSale);
router.put("/:id", updateSale);
router.delete("/:id", deleteSale);

module.exports = router;
