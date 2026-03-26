import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { TaskCommentService } from "./taskComment.service";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskCommentService.createComment(
    req.user.userId,
    req.params.taskId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Comment added successfully",
    data: result,
  });
});

const getTaskComments = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskCommentService.getTaskComments(
    req.params.taskId as string,
    req.query,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Comments retrieved successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskCommentService.updateComment(
    req.user.userId,
    req.params.commentId as string,
    req.body,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  await TaskCommentService.deleteComment(
    req.user.userId,
    req.params.commentId as string,
  );
  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully",
    data: null,
  });
});

export const TaskCommentController = {
  createComment,
  getTaskComments,
  updateComment,
  deleteComment,
};
