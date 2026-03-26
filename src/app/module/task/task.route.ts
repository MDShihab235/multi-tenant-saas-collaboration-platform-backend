import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { TaskController } from "./task.controller";
import { TaskValidation } from "./task.validation";

const router = Router();

router.post(
  "/:projectId",
  checkAuth(),
  validateRequest(TaskValidation.createTaskSchema),
  TaskController.createTask,
);
router.get("/my-tasks", checkAuth(), TaskController.getMyTasks);
router.get("/:projectId", checkAuth(), TaskController.getProjectTasks);
router.get("/:projectId/:taskId", checkAuth(), TaskController.getTaskDetails);
router.patch(
  "/:projectId/:taskId",
  checkAuth(),
  validateRequest(TaskValidation.updateTaskSchema),
  TaskController.updateTask,
);
router.patch(
  "/:projectId/:taskId/status",
  checkAuth(),
  validateRequest(TaskValidation.updateStatusSchema),
  TaskController.updateTaskStatus,
);
router.patch(
  "/:projectId/:taskId/assign",
  checkAuth(),
  validateRequest(TaskValidation.assignTaskSchema),
  TaskController.assignTask,
);
router.patch(
  "/:projectId/:taskId/unassign",
  checkAuth(),
  TaskController.unassignTask,
);
router.delete("/:projectId/:taskId", checkAuth(), TaskController.deleteTask);

export const TaskRoutes = router;
