// ============================================================
//  Subscription Module — Routes
//  Base    : /api/v1/subscriptions
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionValidation } from "./subscription.validation";

const router = Router();

// 1. Subscribe an org to a plan — start trial or billing
router.post(
  "/:orgId/subscribe",
  checkAuth(),
  validateRequest(SubscriptionValidation.subscribeSchema),
  SubscriptionController.subscribe,
);

// 2. Get current active subscription for an org
router.get("/:orgId", checkAuth(), SubscriptionController.getSubscription);

// 3. Current plan usage vs limits (projects, members, tasks…)
router.get("/:orgId/usage", checkAuth(), SubscriptionController.getUsage);

// 4. Upgrade to a higher-tier plan
router.patch(
  "/:orgId/upgrade",
  checkAuth(),
  validateRequest(SubscriptionValidation.changePlanSchema),
  SubscriptionController.upgradeSubscription,
);

// 5. Downgrade to a lower-tier plan
router.patch(
  "/:orgId/downgrade",
  checkAuth(),
  validateRequest(SubscriptionValidation.changePlanSchema),
  SubscriptionController.downgradeSubscription,
);

// 6. Switch between MONTHLY and YEARLY billing
router.patch(
  "/:orgId/billing-cycle",
  checkAuth(),
  validateRequest(SubscriptionValidation.changeBillingCycleSchema),
  SubscriptionController.changeBillingCycle,
);

// 7. Cancel subscription at end of current period
router.patch(
  "/:orgId/cancel",
  checkAuth(),
  SubscriptionController.cancelSubscription,
);

// 8. Reactivate a previously canceled subscription
router.patch(
  "/:orgId/reactivate",
  checkAuth(),
  SubscriptionController.reactivateSubscription,
);

export const SubscriptionRoutes = router;
