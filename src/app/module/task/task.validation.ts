import { z } from "zod";
import { TaskPriority, TaskStatus } from "../../../generated/prisma/enums";

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255),
    description: z.string().optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.string().datetime().optional(),
    assigneeId: z.string().optional(),
    labelIds: z.array(z.string()).optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.string().datetime().optional(),
  }),
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(TaskStatus),
  }),
});

const assignTaskSchema = z.object({
  body: z.object({
    userId: z.string(),
  }),
});

export const TaskValidation = {
  createTaskSchema,
  updateTaskSchema,
  updateStatusSchema,
  assignTaskSchema,
};
