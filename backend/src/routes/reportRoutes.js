const express = require("express");

const router = express.Router();

const {
  getSalesReport,
  exportSalesReportCSV,
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ADMIN ONLY - View sales report
router.get(
  "/sales",
  authMiddleware,
  roleMiddleware("admin"),
  getSalesReport
);

// ADMIN ONLY - Export sales report as CSV
router.get(
  "/sales/csv",
  authMiddleware,
  roleMiddleware("admin"),
  exportSalesReportCSV
);

module.exports = router;