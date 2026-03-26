import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { TaskService } from "./task.service";

const createTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.createTask(
    req.user.userId,
    req.params.projectId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Task created",
    data: result,
  });
});

const getProjectTasks = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getProjectTasks(
    req.params.projectId as string,
    req.query,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Tasks retrieved",
    data: result,
  });
});

const getMyTasks = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getMyTasks(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "My tasks retrieved",
    data: result,
  });
});

const getTaskDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getTaskDetails(req.params.taskId as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Task details retrieved",
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.updateTask(
    req.params.taskId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Task updated",
    data: result,
  });
});

const updateTaskStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.updateTaskStatus(
    req.params.taskId as string,
    req.body.status,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Status updated",
    data: result,
  });
});

const assignTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.assignTask(
    req.params.taskId as string,
    req.body.userId,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Task assigned",
    data: result,
  });
});

const unassignTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.unassignTask(req.params.taskId as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Task unassigned",
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  await TaskService.deleteTask(req.params.taskId as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Task deleted",
    data: null,
  });
});

export const TaskController = {
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
