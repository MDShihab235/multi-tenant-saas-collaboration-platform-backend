import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { NotificationController } from "./notification.controller";
import { NotificationValidation } from "./notification.validation";

const router = Router();

// 1. Get all notifications (paginated)
router.get("/", checkAuth(), NotificationController.getAllNotifications);

// 2. Get only unread notifications
router.get(
  "/unread",
  checkAuth(),
  NotificationController.getUnreadNotifications,
);

// 3. Get unread count for badge
router.get("/count", checkAuth(), NotificationController.getUnreadCount);

// 4. Mark single as read
router.patch(
  "/:notifId/read",
  checkAuth(),
  validateRequest(NotificationValidation.notificationIdSchema),
  NotificationController.markAsRead,
);

// 5. Mark all as read
router.patch("/read-all", checkAuth(), NotificationController.markAllAsRead);

// 6. Delete single
router.delete(
  "/:notifId",
  checkAuth(),
  validateRequest(NotificationValidation.notificationIdSchema),
  NotificationController.deleteNotification,
);

// 7. Clear all
router.delete(
  "/clear-all",
  checkAuth(),
  NotificationController.clearAllNotifications,
);

export const NotificationRoutes = router;
