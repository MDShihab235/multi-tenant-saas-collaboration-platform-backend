// ============================================================
//  File Module — Validation (Zod)
// ============================================================

import { z } from "zod";

const fileIdParamSchema = z.object({
  params: z.object({
    fileId: z.string("File ID is required"),
  }),
});

const paginationSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const FileValidation = {
  fileIdParamSchema,
  paginationSchema,
};
