import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { TaskCommentController } from "./taskComment.controller";
import { TaskCommentValidation } from "./taskComment.validation";

const router = Router();

// 1. Add a comment to a task
router.post(
  "/:taskId",
  checkAuth(),
  validateRequest(TaskCommentValidation.createCommentSchema),
  TaskCommentController.createComment,
);

// 2. List all comments for a task (paginated)
router.get("/:taskId", checkAuth(), TaskCommentController.getTaskComments);

// 3. Edit own comment
router.patch(
  "/:taskId/:commentId",
  checkAuth(),
  validateRequest(TaskCommentValidation.updateCommentSchema),
  TaskCommentController.updateComment,
);

// 4. Delete a comment
router.delete(
  "/:taskId/:commentId",
  checkAuth(),
  TaskCommentController.deleteComment,
);

export const TaskCommentRoutes = router;
