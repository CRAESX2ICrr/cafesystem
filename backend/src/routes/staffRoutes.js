const express = require("express");

const router = express.Router();

const {
  createStaff,
  getStaff,
  updateStaff,
  disableStaff,
  enableStaff,
  deleteStaff,
} = require("../controllers/staffController");

const protect = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ADMIN ONLY

router.post("/", protect, roleMiddleware("admin"), createStaff);

router.get("/", protect, roleMiddleware("admin"), getStaff);

router.put("/:id", protect, roleMiddleware("admin"), updateStaff);

router.put(
  "/:id/disable",
  protect,
  roleMiddleware("admin"),
  disableStaff
);

router.put(
  "/:id/enable",
  protect,
  roleMiddleware("admin"),
  enableStaff
);

router.delete(
  "/:id",
  protect,
  roleMiddleware("admin"),
  deleteStaff
);

module.exports = router;