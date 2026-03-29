// ============================================================
//  Organization Module — Routes
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Base    : /api/v1/organizations
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { OrganizationController } from "./organization.controller";
import { OrganizationValidation } from "./organization.validation";

const router = Router();

// ── Authenticated user routes ─────────────────────────────────

// 1. Create a new organization — caller becomes owner
// POST /api/v1/organization
// Body : { name, slug }
router.post(
  "/",
  checkAuth(),
  validateRequest(OrganizationValidation.createOrganizationSchema),
  OrganizationController.createOrganization,
);

// 2. Get all organizations the current user is a member of
// GET /api/v1/organizations/my
router.get("/my", checkAuth(), OrganizationController.getMyOrganizations);

// 7. Get stats for a specific org — member and project counts, subscription
// GET /api/v1/organizations/:orgId/stats
// Note: registered before /:orgId to prevent Express matching "stats" as an orgId
router.get(
  "/:orgId/stats",
  checkAuth(),
  OrganizationController.getOrganizationStats,
);

// 4. Get full details of a specific organization
// GET /api/v1/organizations/:orgId
router.get("/:orgId", checkAuth(), OrganizationController.getOrganizationById);

// 5. Update org name or slug — owner only
// PATCH /api/v1/organizations/:orgId
// Body : { name?, slug? }
router.patch(
  "/:orgId",
  checkAuth(),
  validateRequest(OrganizationValidation.updateOrganizationSchema),
  OrganizationController.updateOrganization,
);

// 6. Delete org and all cascade data — owner only
// DELETE /api/v1/organizations/:orgId
router.delete(
  "/:orgId",
  checkAuth(),
  OrganizationController.deleteOrganization,
);

// ── Admin-only routes ─────────────────────────────────────────

// 3. List all organizations platform-wide — paginated and searchable
// GET /api/v1/organizations?page=1&limit=10&search=acme
// Note: registered last so "/my" and "/:orgId/stats" are matched first
router.get("/", checkAuth(), OrganizationController.getAllOrganizations);

// ─────────────────────────────────────────────────────────────

export const OrganizationRoutes = router;
