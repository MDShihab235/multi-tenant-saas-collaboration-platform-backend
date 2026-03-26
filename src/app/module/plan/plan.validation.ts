// ============================================================
//  Plan Module — Validation (Zod)
// ============================================================

import { z } from "zod";

const createPlanSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Plan name must be at least 2 characters").max(50),
    price: z.number().min(0, "Price cannot be negative"),
    trialDays: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

const updatePlanSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    price: z.number().min(0).optional(),
    trialDays: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

const createFeatureSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    limitValue: z.number().optional(),
    isEnabled: z.boolean().optional(),
  }),
});

const updateFeatureSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    limitValue: z.number().optional(),
    isEnabled: z.boolean().optional(),
  }),
});

export const PlanValidation = {
  createPlanSchema,
  updatePlanSchema,
  createFeatureSchema,
  updateFeatureSchema,
};
