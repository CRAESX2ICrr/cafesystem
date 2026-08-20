const express = require("express");

const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Customer places an order
router.post("/", authMiddleware, createOrder);

// Customer views their own orders
router.get("/my-orders", authMiddleware, getMyOrders);

// Staff views all orders
router.get(
  "/",
  authMiddleware,
  roleMiddleware("staff"),
  getAllOrders
);

// Staff updates order status
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("staff"),
  updateOrderStatus
);

module.exports = router;