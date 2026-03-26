// ============================================================
//  Membership Module — Routes
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Base    : /api/v1/memberships
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { MembershipController } from "./membership.controller";
import { MembershipValidation } from "./membership.validation";

const router = Router();

// 1. List all members of an organization
router.get("/:orgId", checkAuth(), MembershipController.getOrganizationMembers);

// 2. Get a specific member's details and role
router.get(
  "/:orgId/:userId",
  checkAuth(),
  MembershipController.getMemberDetails,
);

// 3. Change a member's role
router.patch(
  "/:orgId/:userId/role",
  checkAuth(),
  validateRequest(MembershipValidation.updateRoleSchema),
  MembershipController.updateMemberRole,
);

// 4. Remove (kick) a member from the organization
router.delete(
  "/:orgId/:userId",
  checkAuth(),
  MembershipController.removeMember,
);

// 5. Current user leaves the organization voluntarily
router.delete(
  "/:orgId/leave",
  checkAuth(),
  MembershipController.leaveOrganization,
);

export const MembershipRoutes = router;
