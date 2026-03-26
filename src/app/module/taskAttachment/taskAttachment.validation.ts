import { z } from "zod";

// For multipart/form-data, we typically validate the params rather than the body via Zod,
// as the body parsing is handled by Multer. We can validate the file existence in the controller.

const attachmentParamsSchema = z.object({
  params: z.object({
    taskId: z.string("Task ID is required"),
    attachmentId: z.string().optional(),
  }),
});

export const TaskAttachmentValidation = {
  attachmentParamsSchema,
};
