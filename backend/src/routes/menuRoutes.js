const express = require("express");

const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Anyone can view menu
router.get("/", getMenuItems);

// Admin only
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createMenuItem
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateMenuItem
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteMenuItem
);

module.exports = router;