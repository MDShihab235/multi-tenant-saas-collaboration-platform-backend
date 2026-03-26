import { TaskPriority, TaskStatus } from "../../../generated/prisma/enums";

export interface ICreateTaskPayload {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  assigneeId?: string;
  labelIds?: string[];
}

export interface IUpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
}

export interface ITaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  searchTerm?: string;
}
