// ============================================================
//  Plan Module — Validation (Zod)
// ============================================================

import { z } from "zod";

// backend/src/app/modules/plan/plan.validation.ts

const createPlanSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Plan name must be at least 2 characters").max(50),
    slug: z
      .string()
      .min(2)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"), // Matches your org slug logic
    priceMonthly: z.number().min(0, "Monthly price cannot be negative"),
    priceYearly: z.number().min(0, "Yearly price cannot be negative"),
    currency: z.string().optional().default("USD"),
    trialDays: z.number().min(0).optional().default(14),
    isActive: z.boolean().optional().default(true),
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
