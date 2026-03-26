// ============================================================
//  Permission Module — Routes
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Base    : /api/v1/permissions
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { PermissionController } from "./permission.controller";
import { PermissionValidation } from "./permission.validation";

const router = Router();

// ── Admin-only — platform-level permission catalog ────────────

// 1. Add a new permission to the global catalog
// POST /api/v1/permissions
// Body : { action, resource }
router.post(
  "/",
  checkAuth(),
  validateRequest(PermissionValidation.createPermissionSchema),
  PermissionController.createPermission,
);

// 2. List every permission in the system catalog
// GET /api/v1/permissions
router.get("/", checkAuth(), PermissionController.getAllPermissions);

// 3. Get a single permission's details and role assignments
// GET /api/v1/permissions/:permId
router.get("/:permId", checkAuth(), PermissionController.getPermissionById);

// 4. Update a permission's action or resource label
// PATCH /api/v1/permissions/:permId
// Body : { action?, resource? }
router.patch(
  "/:permId",
  checkAuth(),
  validateRequest(PermissionValidation.updatePermissionSchema),
  PermissionController.updatePermission,
);

// 5. Delete a permission from the catalog (cascades from all roles)
// DELETE /api/v1/permissions/:permId
router.delete("/:permId", checkAuth(), PermissionController.deletePermission);

// ── Authenticated — role-scoped permission management ─────────
// Note: these three routes share :orgId/:roleId as a prefix.
// The /assign sub-route is registered before /:orgId/:roleId
// so Express matches it as a POST and not a GET on the same path.

// 6. Assign a catalog permission to an org role
// POST /api/v1/permissions/:orgId/:roleId/assign
// Body : { permissionId }
router.post(
  "/:orgId/:roleId/assign",
  checkAuth(),
  validateRequest(PermissionValidation.assignPermissionSchema),
  PermissionController.assignPermissionToRole,
);

// 8. List all permissions currently assigned to a role
// GET /api/v1/permissions/:orgId/:roleId
router.get(
  "/:orgId/:roleId",
  checkAuth(),
  PermissionController.getRolePermissions,
);

// 7. Remove a specific permission from a role
// DELETE /api/v1/permissions/:orgId/:roleId/:permId
router.delete(
  "/:orgId/:roleId/:permId",
  checkAuth(),
  PermissionController.removePermissionFromRole,
);

// ─────────────────────────────────────────────────────────────

export const PermissionRoutes = router;
