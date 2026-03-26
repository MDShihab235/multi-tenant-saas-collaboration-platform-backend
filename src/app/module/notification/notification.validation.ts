import { z } from "zod";

const notificationIdSchema = z.object({
  params: z.object({
    notifId: z.string("Notification ID is required"),
  }),
});

export const NotificationValidation = {
  notificationIdSchema,
};
