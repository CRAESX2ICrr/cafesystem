const express = require("express");

const {
  getNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Staff can view notifications
router.get(
  "/",
  authMiddleware,
  roleMiddleware("staff"),
  getNotifications
);

// Staff can mark a notification as read
router.put(
  "/:id/read",
  authMiddleware,
  roleMiddleware("staff"),
  markNotificationAsRead
);

module.exports = router;