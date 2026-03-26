// ============================================================
//  Label Module — Validation (Zod)
// ============================================================

import { z } from "zod";

const createLabelSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Label name is required").max(50),
    color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, "Color must be a valid hex code"),
  }),
});

const updateLabelSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    color: z
      .string()
      .regex(/^#([0-9A-F]{3}){1,2}$/i, "Color must be a valid hex code")
      .optional(),
  }),
});

export const LabelValidation = {
  createLabelSchema,
  updateLabelSchema,
};
