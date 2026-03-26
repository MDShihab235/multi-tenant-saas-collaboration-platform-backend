import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateAttachmentPayload } from "./taskAttachment.interface";
// import { s3Utils } from "../utils/s3Utils"; // Hypothetical S3 utility for signed URLs/Deletion

const uploadAttachment = async (payload: ICreateAttachmentPayload) => {
  // Verify task exists
  const task = await prisma.task.findUnique({ where: { id: payload.taskId } });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found");

  return await prisma.taskAttachment.create({
    data: {
      taskId: payload.taskId,
      fileUrl: payload.fileUrl,
      uploadedBy: payload.uploadedBy,
    },
  });
};

const getTaskAttachments = async (taskId: string) => {
  return await prisma.taskAttachment.findMany({
    where: { taskId },
    orderBy: { id: "desc" }, // No createdAt field in your specific schema, using ID as fallback proxy for sorting
  });
};

const getAttachmentDetails = async (taskId: string, attachmentId: string) => {
  const attachment = await prisma.taskAttachment.findFirst({
    where: { id: attachmentId, taskId },
  });

  if (!attachment) throw new AppError(status.NOT_FOUND, "Attachment not found");

  // If using private S3 buckets, you would generate a signed URL here:
  // const signedUrl = await s3Utils.generateSignedDownloadUrl(attachment.fileUrl);

  return {
    ...attachment,
    // signedUrl: signedUrl // Attach the temporary download link
    signedUrl: attachment.fileUrl, // Placeholder
  };
};

const deleteAttachment = async (
  userId: string,
  taskId: string,
  attachmentId: string,
) => {
  const attachment = await prisma.taskAttachment.findFirst({
    where: { id: attachmentId, taskId },
    include: {
      task: { include: { project: { include: { projectMembers: true } } } },
    },
  });

  if (!attachment) throw new AppError(status.NOT_FOUND, "Attachment not found");

  // Authorization: Only the uploader OR a Project Owner/Manager can delete the file
  const isUploader = attachment.uploadedBy === userId;
  const projectMember = attachment.task.project.projectMembers.find(
    (m) => m.userId === userId,
  );
  const isPrivileged =
    projectMember &&
    (projectMember.role === "OWNER" || projectMember.role === "MANAGER");

  if (!isUploader && !isPrivileged) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to delete this attachment",
    );
  }

  // First, delete the file from your cloud storage (S3, Cloudinary, etc.)
  // await s3Utils.deleteFile(attachment.fileUrl);

  // Then, remove the record from the database
  return await prisma.taskAttachment.delete({
    where: { id: attachmentId },
  });
};

export const TaskAttachmentService = {
  uploadAttachment,
  getTaskAttachments,
  getAttachmentDetails,
  deleteAttachment,
};
