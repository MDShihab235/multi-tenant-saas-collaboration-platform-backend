// ============================================================
//  Label Module — Routes
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { LabelController } from "./label.controller";
import { LabelValidation } from "./label.validation";

const router = Router();

// 1. Create a label for a project
router.post(
  "/:projectId",
  checkAuth(),
  validateRequest(LabelValidation.createLabelSchema),
  LabelController.createLabel,
);

// 2. List all labels in a project
router.get("/:projectId", checkAuth(), LabelController.getProjectLabels);

// 3. Update label name or color
router.patch(
  "/:projectId/:labelId",
  checkAuth(),
  validateRequest(LabelValidation.updateLabelSchema),
  LabelController.updateLabel,
);

// 4. Delete a label
router.delete("/:projectId/:labelId", checkAuth(), LabelController.deleteLabel);

// 5. Attach a label to a task
router.post(
  "/:taskId/assign/:labelId",
  checkAuth(),
  LabelController.assignLabelToTask,
);

// 6. Detach a label from a task
router.delete(
  "/:taskId/remove/:labelId",
  checkAuth(),
  LabelController.removeLabelFromTask,
);

// 7. List all labels attached to a task
router.get("/:taskId/assigned", checkAuth(), LabelController.getTaskLabels);

export const LabelRoutes = router;
