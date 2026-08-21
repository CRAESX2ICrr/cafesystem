const express = require("express");

const {
  getNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Staff and admin can view notifications
router.get(
  "/",
  authMiddleware,
  roleMiddleware("staff", "admin"),
  getNotifications
);

// Staff and admin can mark a notification as read
router.put(
  "/:id/read",
  authMiddleware,
  roleMiddleware("staff", "admin"),
  markNotificationAsRead
);

module.exports = router;