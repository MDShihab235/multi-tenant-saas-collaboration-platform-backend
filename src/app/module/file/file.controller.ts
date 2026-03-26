// ============================================================
//  File Module — Controller
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { FileService } from "./file.service";

const uploadFile = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please provide a file to upload",
    );
  }

  const result = await FileService.uploadFile({
    uploadedBy: req.user.userId,
    url: file.path, // Cloudinary URL returned by multer-storage-cloudinary
    mimeType: file.mimetype,
    sizeBytes: file.size,
  });

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "File uploaded successfully",
    data: result,
  });
});

const getMyFiles = catchAsync(async (req: Request, res: Response) => {
  const result = await FileService.getMyFiles(req.user.userId, req.query);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Your files retrieved successfully",
    data: result,
  });
});

const getFileDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await FileService.getFileDetails(
    req.user.userId,
    req.user.role,
    req.params.fileId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "File details retrieved",
    data: result,
  });
});

const deleteFile = catchAsync(async (req: Request, res: Response) => {
  await FileService.deleteFile(
    req.user.userId,
    req.user.role,
    req.params.fileId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "File and metadata deleted successfully",
    data: null,
  });
});

const getAllPlatformFiles = catchAsync(async (req: Request, res: Response) => {
  const result = await FileService.getAllPlatformFiles(req.query);
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Platform files retrieved successfully",
    data: result,
  });
});

export const FileController = {
  uploadFile,
  getMyFiles,
  getFileDetails,
  deleteFile,
  getAllPlatformFiles,
};
