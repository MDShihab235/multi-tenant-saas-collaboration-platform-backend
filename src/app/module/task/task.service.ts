import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { TaskStatus } from "../../../generated/prisma/enums";

const createTask = async (
  creatorId: string,
  projectId: string,
  payload: any,
) => {
  const { labelIds, ...taskData } = payload;
  return await prisma.task.create({
    data: {
      ...taskData,
      projectId,
      creatorId,
      // Connect existing labels if provided
      labels: labelIds
        ? { connect: labelIds.map((id: string) => ({ id })) }
        : undefined,
    },
  });
};

const getProjectTasks = async (projectId: string, filters: any) => {
  const { status, priority, assignee, assignedTo, searchTerm } = filters;
  return await prisma.task.findMany({
    where: {
      projectId,
      status,
      priority,
      assignedTo,
      assignee,
      title: searchTerm
        ? { contains: searchTerm, mode: "insensitive" }
        : undefined,
    },
    include: {
      assignee: { select: { name: true, image: true } },
    },
  });
};

const getMyTasks = async (userId: string) => {
  return await prisma.task.findMany({
    where: { assignedTo: userId },
    include: { project: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });
};

const getTaskDetails = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignee: true,
      _count: { select: { comments: true, attachments: true } },
    },
  });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found");
  return task;
};

const updateTask = async (taskId: string, payload: any) => {
  return await prisma.task.update({ where: { id: taskId }, data: payload });
};

const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: { status: newStatus },
  });
};

const assignTask = async (taskId: string, userId: string) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: { assignedTo: userId },
  });
};

const unassignTask = async (taskId: string) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: { assignedTo: null },
  });
};

const deleteTask = async (taskId: string) => {
  return await prisma.task.delete({ where: { id: taskId } });
};

export const TaskService = {
  createTask,
  getProjectTasks,
  getMyTasks,
  getTaskDetails,
  updateTask,
  updateTaskStatus,
  assignTask,
  unassignTask,
  deleteTask,
};
