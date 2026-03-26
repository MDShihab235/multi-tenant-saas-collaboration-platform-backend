// ============================================================
//  File Module — Service
// ============================================================

import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUploadFilePayload } from "./file.interface";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config"; //

const uploadFile = async (payload: IUploadFilePayload) => {
  return await prisma.file.create({
    data: {
      uploadedBy: payload.uploadedBy,
      url: payload.url,
      mimeType: payload.mimeType,
      sizeBytes: payload.sizeBytes,
    },
  });
};

const getMyFiles = async (userId: string, query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [files, total] = await Promise.all([
    prisma.file.findMany({
      where: { uploadedBy: userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.file.count({ where: { uploadedBy: userId } }),
  ]);

  return { meta: { page, limit, total }, data: files };
};

const getFileDetails = async (
  userId: string,
  userRole: any,
  fileId: string,
) => {
  const file = await prisma.file.findUnique({
    where: { id: fileId },
    include: { uploader: { select: { name: true, email: true } } },
  });

  if (!file) throw new AppError(status.NOT_FOUND, "File not found");

  // Only allow access if user is the uploader or a SUPER_ADMIN
  if (file.uploadedBy !== userId && userRole !== "SUPER_ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to view this file",
    );
  }

  // Cloudinary URLs are generally public, but if using private resources, generate signed URL here.
  return file;
};

const deleteFile = async (userId: string, userRole: any, fileId: string) => {
  const file = await prisma.file.findUnique({ where: { id: fileId } });

  if (!file) throw new AppError(status.NOT_FOUND, "File not found");

  // Only allow deletion if user is the uploader or a SUPER_ADMIN
  if (file.uploadedBy !== userId && userRole !== "SUPER_ADMIN") {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to delete this file",
    );
  }

  // 1. Delete object from Cloudinary using your custom utility
  await deleteFileFromCloudinary(file.url);

  // 2. Delete the record from the database
  return await prisma.file.delete({
    where: { id: fileId },
  });
};

const getAllPlatformFiles = async (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [files, total] = await Promise.all([
    prisma.file.findMany({
      include: { uploader: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.file.count(),
  ]);

  return { meta: { page, limit, total }, data: files };
};

export const FileService = {
  uploadFile,
  getMyFiles,
  getFileDetails,
  deleteFile,
  getAllPlatformFiles,
};
