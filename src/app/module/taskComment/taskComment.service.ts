import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const createComment = async (
  userId: string,
  taskId: string,
  payload: { content: string },
) => {
  // Verify task exists before commenting
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new AppError(status.NOT_FOUND, "Task not found");

  return await prisma.taskComment.create({
    data: {
      message: payload.content,
      taskId,
      userId,
    },
    include: {
      user: { select: { name: true, image: true } },
    },
  });
};

const getTaskComments = async (taskId: string, query: any) => {
  const { page = 1, limit = 20 } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const [taskComment, total] = await Promise.all([
    prisma.taskComment.findMany({
      where: { taskId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.taskComment.count({ where: { taskId } }),
  ]);

  return {
    meta: { page: Number(page), limit: Number(limit), total },
    data: taskComment,
  };
};

const updateComment = async (
  userId: string,
  commentId: string,
  payload: { content: string },
) => {
  const comment = await prisma.taskComment.findUnique({
    where: { id: commentId },
  });

  if (!comment) throw new AppError(status.NOT_FOUND, "Comment not found");

  // Authorization: Only author can edit
  if (comment.userId !== userId) {
    throw new AppError(status.FORBIDDEN, "You can only edit your own comments");
  }

  return await prisma.taskComment.update({
    where: { id: commentId },
    data: { message: payload.content },
  });
};

const deleteComment = async (userId: string, commentId: string) => {
  const comment = await prisma.taskComment.findUnique({
    where: { id: commentId },
    include: {
      task: { include: { project: { include: { projectMembers: true } } } },
    },
  });

  if (!comment) throw new AppError(status.NOT_FOUND, "Comment not found");

  // Authorization: Author OR Project Owner/Manager can delete
  const isAuthor = comment.userId === userId;
  const projectMember = comment.task.project.projectMembers.find(
    (m) => m.userId === userId,
  );
  const isPrivileged =
    projectMember &&
    (projectMember.role === "OWNER" || projectMember.role === "MANAGER");

  if (!isAuthor && !isPrivileged) {
    throw new AppError(
      status.FORBIDDEN,
      "You do not have permission to delete this comment",
    );
  }

  return await prisma.taskComment.delete({ where: { id: commentId } });
};

export const TaskCommentService = {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment,
};
