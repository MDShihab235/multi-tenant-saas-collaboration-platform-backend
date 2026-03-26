import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const getAllNotifications = async (userId: string, query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  return {
    meta: { page: Number(page), limit: Number(limit), total },
    data: notifications,
  };
};

const getUnreadNotifications = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: { userId, isRead: false },
    orderBy: { createdAt: "desc" },
  });
  const total = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  return { total, notifications };
};

const getUnreadCount = async (userId: string) => {
  return await prisma.notification.count({
    where: { userId, isRead: false },
  });
};

const markAsRead = async (userId: string, notifId: string) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notifId, userId },
  });

  if (!notification)
    throw new AppError(status.NOT_FOUND, "Notification not found");

  return await prisma.notification.update({
    where: { id: notifId },
    data: { isRead: true },
  });
};

const markAllAsRead = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};

const deleteNotification = async (userId: string, notifId: string) => {
  const notification = await prisma.notification.findFirst({
    where: { id: notifId, userId },
  });

  if (!notification)
    throw new AppError(status.NOT_FOUND, "Notification not found");

  return await prisma.notification.delete({
    where: { id: notifId },
  });
};

const clearAllNotifications = async (userId: string) => {
  return await prisma.notification.deleteMany({
    where: { userId },
  });
};

export const NotificationService = {
  getAllNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};
