// ============================================================
//  Label Module — Controller
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { LabelService } from "./label.service";

const createLabel = catchAsync(async (req: Request, res: Response) => {
  const result = await LabelService.createLabel(
    req.params.projectId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Label created successfully",
    data: result,
  });
});

const getProjectLabels = catchAsync(async (req: Request, res: Response) => {
  const result = await LabelService.getProjectLabels(
    req.params.projectId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Project labels retrieved",
    data: result,
  });
});

const updateLabel = catchAsync(async (req: Request, res: Response) => {
  const result = await LabelService.updateLabel(
    req.params.projectId as string,
    req.params.labelId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Label updated successfully",
    data: result,
  });
});

const deleteLabel = catchAsync(async (req: Request, res: Response) => {
  await LabelService.deleteLabel(
    req.params.projectId as string,
    req.params.labelId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Label deleted successfully",
    data: null,
  });
});

const assignLabelToTask = catchAsync(async (req: Request, res: Response) => {
  const result = await LabelService.assignLabelToTask(
    req.params.taskId as string,
    req.params.labelId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Label attached to task",
    data: result,
  });
});

const removeLabelFromTask = catchAsync(async (req: Request, res: Response) => {
  await LabelService.removeLabelFromTask(
    req.params.taskId as string,
    req.params.labelId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Label detached from task",
    data: null,
  });
});

const getTaskLabels = catchAsync(async (req: Request, res: Response) => {
  const result = await LabelService.getTaskLabels(req.params.taskId as string);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Task labels retrieved",
    data: result,
  });
});

export const LabelController = {
  createLabel,
  getProjectLabels,
  updateLabel,
  deleteLabel,
  assignLabelToTask,
  removeLabelFromTask,
  getTaskLabels,
};
