// ============================================================
//  Plan Module — Routes
//  Base    : /api/v1/plans
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PlanController } from "./plan.controller";
import { PlanValidation } from "./plan.validation";

const router = Router();

// 1. List all active plans — public pricing page
router.get("/", PlanController.getActivePlans);

// 3. Create a new subscription plan (Admin only)
router.post(
  "/",
  checkAuth(), // Assuming SUPER_ADMIN is your platform admin role
  validateRequest(PlanValidation.createPlanSchema),
  PlanController.createPlan,
);

// 2. Get plan details with all features (Public)
router.get("/:planId", PlanController.getPlanDetails);

// 4. Update plan name, pricing, or trial days (Admin only)
router.patch(
  "/:planId",
  checkAuth(),
  validateRequest(PlanValidation.updatePlanSchema),
  PlanController.updatePlan,
);

// 5. Deactivate (soft-delete) a plan (Admin only)
router.delete("/:planId", checkAuth(), PlanController.deactivatePlan);

// 6. Add a feature limit to a plan (Admin only)
router.post(
  "/:planId/features",
  checkAuth(),
  validateRequest(PlanValidation.createFeatureSchema),
  PlanController.addPlanFeature,
);

// 7. List all features for a plan (Public)
router.get("/:planId/features", PlanController.getPlanFeatures);

// 8. Update feature limit value or toggle enabled (Admin only)
router.patch(
  "/:planId/features/:featureId",
  checkAuth(),
  validateRequest(PlanValidation.updateFeatureSchema),
  PlanController.updatePlanFeature,
);

// 9. Remove a feature from a plan (Admin only)
router.delete(
  "/:planId/features/:featureId",
  checkAuth(),
  PlanController.removePlanFeature,
);

export const PlanRoutes = router;
