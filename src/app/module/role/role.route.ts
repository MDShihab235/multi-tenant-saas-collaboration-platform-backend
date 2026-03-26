// ============================================================
//  Role Module — Routes
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Base    : /api/v1/roles
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
// import { validateRequest } from "../../middleware/validateRequest";
import { RoleController } from "./role.controller";

const router = Router();

// 1. Create a custom role inside an organization
router.post("/:orgId", checkAuth(), RoleController.createRole);

// 2. List all roles for an organization
router.get("/:orgId", checkAuth(), RoleController.getOrgRoles);

// 3. Get role details and its assigned permissions
router.get("/:orgId/:roleId", checkAuth(), RoleController.getRoleDetails);

// 4. Update role name
router.patch("/:orgId/:roleId", checkAuth(), RoleController.updateRole);

// 5. Delete a custom role from the org
router.delete("/:orgId/:roleId", checkAuth(), RoleController.deleteRole);

export const RoleRoutes = router;
