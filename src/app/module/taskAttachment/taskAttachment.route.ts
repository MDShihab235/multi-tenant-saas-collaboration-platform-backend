import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { TaskAttachmentController } from "./taskAttachment.controller";
import { TaskAttachmentValidation } from "./taskAttachment.validation";
import { upload } from "../../middleware/upload"; // Assuming you have a multer middleware

const router = Router();

// 1. Upload file to a task (multipart/form-data)
router.post(
  "/:taskId",
  checkAuth(),
  validateRequest(TaskAttachmentValidation.attachmentParamsSchema),
  upload.single("file"), // <-- Inject Multer middleware here
  TaskAttachmentController.uploadAttachment,
);

// 2. List all attachments for a task
router.get(
  "/:taskId",
  checkAuth(),
  validateRequest(TaskAttachmentValidation.attachmentParamsSchema),
  TaskAttachmentController.getTaskAttachments,
);

// 3. Get attachment metadata and signed download URL
router.get(
  "/:taskId/:attachmentId",
  checkAuth(),
  validateRequest(TaskAttachmentValidation.attachmentParamsSchema),
  TaskAttachmentController.getAttachmentDetails,
);

// 4. Delete an attachment from a task
router.delete(
  "/:taskId/:attachmentId",
  checkAuth(),
  validateRequest(TaskAttachmentValidation.attachmentParamsSchema),
  TaskAttachmentController.deleteAttachment,
);

export const TaskAttachmentRoutes = router;
