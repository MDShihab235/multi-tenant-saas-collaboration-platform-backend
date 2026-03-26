// ============================================================
//  Label Module — Service
// ============================================================

import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateLabelPayload, IUpdateLabelPayload } from "./label.interface";

const createLabel = async (projectId: string, payload: ICreateLabelPayload) => {
  // Check for uniqueness within the project [cite: 75]
  const existingLabel = await prisma.label.findFirst({
    where: { projectId, name: payload.name },
  });

  if (existingLabel) {
    throw new AppError(
      status.CONFLICT,
      "A label with this name already exists in the project",
    );
  }

  return await prisma.label.create({
    data: {
      projectId,
      name: payload.name,
      color: payload.color,
    },
  });
};

const getProjectLabels = async (projectId: string) => {
  return await prisma.label.findMany({
    where: { projectId },
    orderBy: { name: "asc" },
  });
};

const updateLabel = async (
  projectId: string,
  labelId: string,
  payload: IUpdateLabelPayload,
) => {
  const label = await prisma.label.findFirst({
    where: { id: labelId, projectId },
  });

  if (!label) throw new AppError(status.NOT_FOUND, "Label not found");

  if (payload.name && payload.name !== label.name) {
    const existingLabel = await prisma.label.findFirst({
      where: { projectId, name: payload.name },
    });
    if (existingLabel) {
      throw new AppError(
        status.CONFLICT,
        "A label with this name already exists",
      );
    }
  }

  return await prisma.label.update({
    where: { id: labelId },
    data: payload,
  });
};

const deleteLabel = async (projectId: string, labelId: string) => {
  const label = await prisma.label.findFirst({
    where: { id: labelId, projectId },
  });

  if (!label) throw new AppError(status.NOT_FOUND, "Label not found");

  // Cascades deletion of TaskLabel records automatically
  return await prisma.label.delete({
    where: { id: labelId },
  });
};

const assignLabelToTask = async (taskId: string, labelId: string) => {
  // Check if it's already assigned
  const existing = await prisma.taskLabel.findUnique({
    where: { taskId_labelId: { taskId, labelId } },
  });

  if (existing) {
    throw new AppError(
      status.CONFLICT,
      "Label is already attached to this task",
    );
  }

  return await prisma.taskLabel.create({
    data: { taskId, labelId },
  });
};

const removeLabelFromTask = async (taskId: string, labelId: string) => {
  const existing = await prisma.taskLabel.findUnique({
    where: { taskId_labelId: { taskId, labelId } },
  });

  if (!existing) {
    throw new AppError(status.NOT_FOUND, "Label is not attached to this task");
  }

  return await prisma.taskLabel.delete({
    where: { taskId_labelId: { taskId, labelId } },
  });
};

const getTaskLabels = async (taskId: string) => {
  const taskLabels = await prisma.taskLabel.findMany({
    where: { taskId },
    include: { label: true },
  });

  // Extract just the label objects for a cleaner response
  return taskLabels.map((tl) => tl.label);
};

export const LabelService = {
  createLabel,
  getProjectLabels,
  updateLabel,
  deleteLabel,
  assignLabelToTask,
  removeLabelFromTask,
  getTaskLabels,
};
