import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { TaskAttachmentService } from "./taskAttachment.service";

const uploadAttachment = catchAsync(async (req: Request, res: Response) => {
  // Assuming multer attaches the file to req.file and gives us a location/path
  const file = req.file;
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please upload a valid file");
  }

  // If using multer-s3, file.location contains the URL. If local, file.path.
  const fileUrl = (file as any).location || file.path;

  const result = await TaskAttachmentService.uploadAttachment({
    taskId: req.params.taskId as string,
    fileUrl: fileUrl,
    uploadedBy: req.user.userId,
  });

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "File uploaded successfully",
    data: result,
  });
});

const getTaskAttachments = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskAttachmentService.getTaskAttachments(
    req.params.taskId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Attachments retrieved successfully",
    data: result,
  });
});

const getAttachmentDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskAttachmentService.getAttachmentDetails(
    req.params.taskId as string,
    req.params.attachmentId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Attachment details retrieved",
    data: result,
  });
});

const deleteAttachment = catchAsync(async (req: Request, res: Response) => {
  await TaskAttachmentService.deleteAttachment(
    req.user.userId,
    req.params.taskId as string,
    req.params.attachmentId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Attachment deleted successfully",
    data: null,
  });
});

export const TaskAttachmentController = {
  uploadAttachment,
  getTaskAttachments,
  getAttachmentDetails,
  deleteAttachment,
};
