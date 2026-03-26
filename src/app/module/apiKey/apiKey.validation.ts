// ============================================================
//  ApiKey Module — Validation (Zod)
// ============================================================

import { z } from "zod";

const createApiKeySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    expiresAt: z.string().datetime().optional(),
  }),
});

const updateApiKeySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    expiresAt: z.string().datetime().nullable().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ApiKeyValidation = {
  createApiKeySchema,
  updateApiKeySchema,
};
