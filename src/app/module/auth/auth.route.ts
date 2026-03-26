// ============================================================
//  Auth Module — Routes
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Base    : /api/v1/auth
// ============================================================

import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = Router();

// ── Public routes (no auth required) ─────────────────────────

// 1. Register a new user account
// POST /api/v1/auth/register
// Body : { name, email, password }
router.post(
  "/register",
  validateRequest(AuthValidation.registerSchema),
  AuthController.register,
);

// 2. Login with email and password
// POST /api/v1/auth/login
// Body : { email, password }
router.post(
  "/login",
  validateRequest(AuthValidation.loginSchema),
  AuthController.login,
);

// 3. Get a new access token using the refresh token cookie
// POST /api/v1/auth/refresh-token
// Cookies : refreshToken, better-auth.session_token
router.post("/refresh-token", AuthController.refreshToken);

// 4. Verify email address with OTP
// POST /api/v1/auth/verify-email
// Body : { email, otp }
router.post(
  "/verify-email",
  validateRequest(AuthValidation.verifyEmailSchema),
  AuthController.verifyEmail,
);

// 5. Resend email verification OTP
// POST /api/v1/auth/resend-verification
// Body : { email }
router.post(
  "/resend-verification",
  validateRequest(AuthValidation.resendVerificationSchema),
  AuthController.resendVerificationEmail,
);

// 6. Request a password-reset OTP via email
// POST /api/v1/auth/forgot-password
// Body : { email }
router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordSchema),
  AuthController.forgotPassword,
);

// 7. Reset password using email OTP
// POST /api/v1/auth/reset-password
// Body : { email, otp, newPassword }
router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordSchema),
  AuthController.resetPassword,
);

// ── Authenticated routes (valid JWT required) ─────────────────

// 8. Get the currently authenticated user's full profile
// GET /api/v1/auth/me
router.get("/me", checkAuth(), AuthController.getMe);

// 9. Change own password (requires current password)
// PATCH /api/v1/auth/change-password
// Body : { currentPassword, newPassword }
router.patch(
  "/change-password",
  checkAuth(),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthController.changePassword,
);

// 10. Logout — invalidates the current session and clears cookies
// POST /api/v1/auth/logout
router.post("/logout", checkAuth(), AuthController.logout);

// 11. List all active sessions for the current user
// GET /api/v1/auth/sessions
router.get("/sessions", checkAuth(), AuthController.getAllSessions);

// 12. Revoke a specific session by ID
// DELETE /api/v1/auth/sessions/:sessionId
router.delete(
  "/sessions/:sessionId",
  checkAuth(),
  AuthController.revokeSession,
);

// 13. Revoke ALL sessions — sign out from every device
// DELETE /api/v1/auth/sessions
router.delete("/sessions", checkAuth(), AuthController.revokeAllSessions);

// ─────────────────────────────────────────────────────────────

export const AuthRoutes = router;
