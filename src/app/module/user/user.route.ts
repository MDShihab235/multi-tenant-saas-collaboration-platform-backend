// ============================================================
//  User Module — Routes
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Base    : /api/v1/users
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = Router();

// ── Authenticated user routes ─────────────────────────────────

// 1. Get the currently authenticated user's full profile
// GET /api/v1/users/me
router.get("/me", checkAuth(), UserController.getMyProfile);

// 2. Update own display name and / or avatar URL
// PATCH /api/v1/users/me
// Body : { name?, image? }
router.patch(
  "/me",
  checkAuth(),
  validateRequest(UserValidation.updateProfileSchema),
  UserController.updateMyProfile,
);

// 3. Change own password — requires current password for verification
// PATCH /api/v1/users/me/change-password
// Body : { currentPassword, newPassword }
router.patch(
  "/me/change-password",
  checkAuth(),
  validateRequest(UserValidation.changeOwnPasswordSchema),
  UserController.changeOwnPassword,
);

// 4. Soft-delete own account — sets isDeleted + deletedAt, revokes sessions
// DELETE /api/v1/users/me
router.delete("/me", checkAuth(), UserController.deleteMyAccount);

// ── Admin-only routes ─────────────────────────────────────────

// 5. List all platform users — paginated and filterable
// GET /api/v1/users?page=1&limit=10&status=ACTIVE&search=john
router.get("/", checkAuth(), UserController.getAllUsers);

// 6. Get any user's full profile by their ID
// GET /api/v1/users/:userId
router.get("/:userId", checkAuth(), UserController.getUserById);

// 7. Change a user's account status: ACTIVE | INACTIVE | BLOCKED
// PATCH /api/v1/users/:userId/status
// Body : { status: "ACTIVE" | "INACTIVE" | "BLOCKED" }
router.patch(
  "/:userId/status",
  checkAuth(),
  validateRequest(UserValidation.updateUserStatusSchema),
  UserController.updateUserStatus,
);

// 8. Force the user to change their password on next login
// PATCH /api/v1/users/:userId/force-password
router.patch(
  "/:userId/force-password",
  checkAuth(),
  UserController.forcePasswordChange,
);

// 9. Permanently remove a user account and all cascade data
// DELETE /api/v1/users/:userId
router.delete("/:userId", checkAuth(), UserController.hardDeleteUser);

// ─────────────────────────────────────────────────────────────

export const UserRoutes = router;
