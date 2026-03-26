import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { NotificationService } from "./notification.service";

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const result = await NotificationService.getAllNotifications(
    req.user.userId,
    req.query,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Notifications retrieved successfully",
    data: result,
  });
});

const getUnreadNotifications = catchAsync(
  async (req: Request, res: Response) => {
    const result = await NotificationService.getUnreadNotifications(
      req.user.userId,
    );
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Unread notifications retrieved",
      data: result,
    });
  },
);

const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
  const count = await NotificationService.getUnreadCount(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Unread count retrieved",
    data: { count },
  });
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
  await NotificationService.markAsRead(
    req.user.userId,
    req.params.notifId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Notification marked as read",
    data: null,
  });
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
  await NotificationService.markAllAsRead(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "All notifications marked as read",
    data: null,
  });
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
  await NotificationService.deleteNotification(
    req.user.userId,
    req.params.notifId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Notification deleted",
    data: null,
  });
});

const clearAllNotifications = catchAsync(
  async (req: Request, res: Response) => {
    await NotificationService.clearAllNotifications(req.user.userId);
    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "All notifications cleared",
      data: null,
    });
  },
);

export const NotificationController = {
  getAllNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};
