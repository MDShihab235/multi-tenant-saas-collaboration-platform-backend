// ============================================================
//  Project Module — Service
// ============================================================

import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const createProject = async (
  userId: string,
  orgId: string,
  payload: { name: string; description?: string },
) => {
  return await prisma.project.create({
    data: {
      ...payload,
      organizationId: orgId,
      createdBy: userId,
      // Automatically add the creator as the first member (OWNER role)
      projectMembers: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });
};

const getOrgProjects = async (orgId: string, query: any) => {
  const { page = 1, limit = 10, searchTerm = "" } = query;
  const skip = (Number(page) - 1) * Number(limit);

  return await prisma.project.findMany({
    where: {
      organizationId: orgId,
      OR: [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ],
    },
    skip,
    take: Number(limit),
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tasks: true, projectMembers: true } } },
  });
};

const getMyProjects = async (userId: string) => {
  return await prisma.project.findMany({
    where: {
      projectMembers: { some: { userId } },
    },
    include: { organization: { select: { name: true, slug: true } } },
  });
};

const getProjectDetails = async (orgId: string, projectId: string) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: orgId },
    include: {
      projectMembers: {
        include: { user: { select: { name: true, image: true } } },
      },
      labels: true,
    },
  });
  if (!project) throw new AppError(status.NOT_FOUND, "Project not found");
  return project;
};

const updateProject = async (projectId: string, payload: any) => {
  return await prisma.project.update({
    where: { id: projectId },
    data: payload,
  });
};

const deleteProject = async (projectId: string) => {
  // Cascading deletes for tasks and members are handled by Prisma (onDelete: Cascade)
  return await prisma.project.delete({
    where: { id: projectId },
  });
};

const getProjectStats = async (projectId: string) => {
  const tasks = await prisma.task.groupBy({
    by: ["status"],
    where: { projectId },
    _count: { _all: true },
  });

  // Calculate open vs closed (Assuming 'DONE' is closed)
  const totalTasks = await prisma.task.count({ where: { projectId } });
  const closedTasks = await prisma.task.count({
    where: { projectId, status: "DONE" },
  });

  return {
    statusBreakdown: tasks,
    openTasks: totalTasks - closedTasks,
    closedTasks,
    completionPercentage: totalTasks > 0 ? (closedTasks / totalTasks) * 100 : 0,
  };
};

export const ProjectService = {
  createProject,
  getOrgProjects,
  getMyProjects,
  getProjectDetails,
  updateProject,
  deleteProject,
  getProjectStats,
};
