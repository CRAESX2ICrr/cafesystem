const express = require("express");

const {
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin only: get all suppliers
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getSuppliers
);

// Admin only: get one supplier
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getSupplierById
);

// Admin only: create supplier
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createSupplier
);

// Admin only: update supplier
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateSupplier
);

// Admin only: delete supplier
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteSupplier
);

module.exports = router;