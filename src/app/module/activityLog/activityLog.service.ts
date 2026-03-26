import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { subDays } from "date-fns";
import { Prisma } from "../../../generated/prisma/client";

const getOrgLogs = async (orgId: string, query: any) => {
  const { page = 1, limit = 20 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where: { organizationId: orgId },
      include: { actor: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.activityLog.count({ where: { organizationId: orgId } }),
  ]);

  return {
    meta: { total, page: Number(page), limit: Number(limit) },
    data: logs,
  };
};

const filterLogs = async (orgId: string, filters: any) => {
  const { actorId, action, startDate, endDate, page = 1, limit = 20 } = filters;

  const where: Prisma.ActivityLogWhereInput = { organizationId: orgId };
  if (actorId) where.actorId = actorId;
  if (action) where.action = { contains: action, mode: "insensitive" };
  if (startDate || endDate) {
    where.createdAt = {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate && { lte: new Date(endDate) }),
    };
  }

  const logs = await prisma.activityLog.findMany({
    where,
    include: { actor: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  return logs;
};

const getLogById = async (orgId: string, logId: string) => {
  const log = await prisma.activityLog.findFirst({
    where: { id: logId, organizationId: orgId },
    include: { actor: { select: { name: true, email: true } } },
  });

  if (!log) throw new AppError(status.NOT_FOUND, "Log entry not found");
  return log;
};

const purgeLogs = async (userId: string, orgId: string, days: number) => {
  // Check if user is Organization Creator/Owner (Simplified check)
  const org = await prisma.organization.findFirst({
    where: { id: orgId, ownerId: userId },
  });

  if (!org) {
    throw new AppError(
      status.FORBIDDEN,
      "Only the organization owner can purge logs",
    );
  }

  const dateLimit = subDays(new Date(), days);

  const result = await prisma.activityLog.deleteMany({
    where: {
      organizationId: orgId,
      createdAt: { lt: dateLimit },
    },
  });

  return result;
};

export const ActivityLogService = {
  getOrgLogs,
  filterLogs,
  getLogById,
  purgeLogs,
};
