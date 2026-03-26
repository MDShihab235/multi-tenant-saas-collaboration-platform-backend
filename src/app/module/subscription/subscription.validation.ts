// ============================================================
//  Subscription Module — Validation (Zod)
// ============================================================

import { z } from "zod";

const subscribeSchema = z.object({
  body: z.object({
    planId: z.string().min(1, "Plan ID is required"),
    billingCycle: z.enum(
      ["MONTHLY", "YEARLY"],
      "Billing cycle must be MONTHLY or YEARLY",
    ),
  }),
});

const changePlanSchema = z.object({
  body: z.object({
    planId: z.string().min(1, "New Plan ID is required"),
  }),
});

const changeBillingCycleSchema = z.object({
  body: z.object({
    billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  }),
});

export const SubscriptionValidation = {
  subscribeSchema,
  changePlanSchema,
  changeBillingCycleSchema,
};
