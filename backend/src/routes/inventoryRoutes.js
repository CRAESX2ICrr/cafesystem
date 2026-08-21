const express = require("express");

const {
  getIngredients,
  getLowStockIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} = require("../controllers/inventoryController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Staff and admin can view low-stock alerts
router.get(
  "/low-stock",
  authMiddleware,
  roleMiddleware("staff", "admin"),
  getLowStockIngredients
);

// Staff and admin can view inventory
router.get(
  "/",
  authMiddleware,
  roleMiddleware("staff", "admin"),
  getIngredients
);

// Admin only: add a new ingredient
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createIngredient
);

// Admin only: update / restock an ingredient
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateIngredient
);

// Admin only: delete an ingredient
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteIngredient
);

module.exports = router;