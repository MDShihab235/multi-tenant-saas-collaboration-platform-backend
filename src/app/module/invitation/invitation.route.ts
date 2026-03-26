// ============================================================
//  Invitation Module — Routes
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Base    : /api/v1/invitations
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { InvitationController } from "./invitation.contoller";
import { InvitationValidation } from "./invitation.validation";

const router = Router();

// 1. Send email invitation (Auth required)
router.post(
  "/:orgId",
  checkAuth(),
  validateRequest(InvitationValidation.sendInvitationSchema),
  InvitationController.sendInvitation,
);

// 2. List all pending invitations for an org (Auth required)
router.get("/:orgId", checkAuth(), InvitationController.getOrgInvitations);

// 3. Revoke/Cancel an invitation (Auth required)
router.delete(
  "/:invitationId/revoke",
  checkAuth(),
  InvitationController.revokeInvitation,
);

// 4. Validate invitation token (Public)
router.get("/verify/:token", InvitationController.verifyInvitationToken);

// 5. Accept invitation (Public - but usually requires user to be logged in/registered)
router.post(
  "/accept",
  validateRequest(InvitationValidation.tokenActionSchema),
  InvitationController.acceptInvitation,
);

// 6. Decline invitation (Public)
router.post(
  "/decline",
  validateRequest(InvitationValidation.tokenActionSchema),
  InvitationController.declineInvitation,
);

export const InvitationRoutes = router;
