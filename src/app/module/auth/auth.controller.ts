// ============================================================
//  Auth Module — Controller
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Deps    : express, http-status, ms
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { CookieUtils } from "../../utils/cookie";
import { AuthService } from "./auth.service";

// ── 1. Register ───────────────────────────────────────────────
// POST /api/v1/auth/register
// Body : { name, email, password }
// Res  : 201 — user object + token trio
const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);

  const { accessToken, refreshToken, sessionToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

  sendResponse(res, {
    httpStatusCode: httpStatus.CREATED,
    success: true,
    message: "Account created successfully",
    data: { accessToken, refreshToken, sessionToken },
  });
});

// ── 2. Login ──────────────────────────────────────────────────
// POST /api/v1/auth/login
// Body : { email, password }
// Res  : 200 — token trio set as cookies
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  const { accessToken, refreshToken, sessionToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully",
    data: { accessToken, refreshToken, sessionToken },
  });
});

// ── 3. Logout ─────────────────────────────────────────────────
// POST /api/v1/auth/logout
// Auth : required (any authenticated user)
// Res  : 200 — all cookies cleared
const logout = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session_token"];

  await AuthService.logout(sessionToken);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
  };
  CookieUtils.clearCookie(res, "accessToken", cookieOptions);
  CookieUtils.clearCookie(res, "refreshToken", cookieOptions);
  CookieUtils.clearCookie(res, "better-auth.session_token", cookieOptions);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

// ── 4. Refresh token ──────────────────────────────────────────
// POST /api/v1/auth/refresh-token
// Cookies : refreshToken, better-auth.session_token
// Res  : 200 — new token trio
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies.refreshToken;
  const sessionToken = req.cookies["better-auth.session_token"];

  if (!incomingRefreshToken) {
    return sendResponse(res, {
      httpStatusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "Refresh token is missing",
      data: null,
    });
  }

  const result = await AuthService.refreshToken(
    incomingRefreshToken,
    sessionToken,
  );

  const {
    accessToken,
    refreshToken: newRefreshToken,
    sessionToken: newSessionToken,
  } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, newSessionToken);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Tokens refreshed successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken: newSessionToken,
    },
  });
});

// ── 5. Get me ─────────────────────────────────────────────────
// GET /api/v1/auth/me
// Auth : required
// Res  : 200 — full user profile with org memberships
const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getMe(req.user);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

// ── 6. Change password ────────────────────────────────────────
// PATCH /api/v1/auth/change-password
// Auth : required
// Body : { currentPassword, newPassword }
// Res  : 200 — new token trio (other sessions revoked)
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session_token"];

  const result = await AuthService.changePassword(req.body, sessionToken);

  const { accessToken, refreshToken, sessionToken: newSessionToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, newSessionToken);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: { accessToken, refreshToken },
  });
});

// ── 7. Verify email ───────────────────────────────────────────
// POST /api/v1/auth/verify-email
// Body : { email, otp }
// Res  : 200 — success confirmation
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  await AuthService.verifyEmail(email, otp);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Email verified successfully",
    data: null,
  });
});

// ── 8. Resend verification email ──────────────────────────────
// POST /api/v1/auth/resend-verification
// Body : { email }
// Res  : 200 — OTP sent confirmation
const resendVerificationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    await AuthService.resendVerificationEmail(email);

    sendResponse(res, {
      httpStatusCode: httpStatus.OK,
      success: true,
      message: "Verification email sent successfully",
      data: null,
    });
  },
);

// ── 9. Forgot password ────────────────────────────────────────
// POST /api/v1/auth/forgot-password
// Body : { email }
// Res  : 200 — OTP sent (same response even if email not found)
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  await AuthService.forgotPassword(email);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "If an account exists, a password reset OTP has been sent",
    data: null,
  });
});

// ── 10. Reset password ────────────────────────────────────────
// POST /api/v1/auth/reset-password
// Body : { email, otp, newPassword }
// Res  : 200 — all sessions revoked, password updated
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await AuthService.resetPassword(req.body);

  // Clear all cookies since all sessions were revoked on reset
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
  };
  CookieUtils.clearCookie(res, "accessToken", cookieOptions);
  CookieUtils.clearCookie(res, "refreshToken", cookieOptions);
  CookieUtils.clearCookie(res, "better-auth.session_token", cookieOptions);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message:
      "Password reset successfully. Please log in with your new password",
    data: null,
  });
});

// ── 11. Get all sessions ──────────────────────────────────────
// GET /api/v1/auth/sessions
// Auth : required
// Res  : 200 — list of all active sessions (no raw tokens)
const getAllSessions = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getAllSessions(req.user.userId);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Active sessions fetched successfully",
    data: result,
  });
});

// ── 12. Revoke single session ─────────────────────────────────
// DELETE /api/v1/auth/sessions/:sessionId
// Auth  : required
// Param : sessionId
// Res   : 200 — session deleted
const revokeSession = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  await AuthService.revokeSession(req.user.userId, sessionId as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Session revoked successfully",
    data: null,
  });
});

// ── 13. Revoke all sessions ───────────────────────────────────
// DELETE /api/v1/auth/sessions
// Auth  : required
// Res   : 200 — all sessions deleted, cookies cleared
const revokeAllSessions = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.revokeAllSessions(req.user.userId);

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
  };
  CookieUtils.clearCookie(res, "accessToken", cookieOptions);
  CookieUtils.clearCookie(res, "refreshToken", cookieOptions);
  CookieUtils.clearCookie(res, "better-auth.session_token", cookieOptions);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: `All ${result.count} session(s) revoked. You have been signed out everywhere`,
    data: result,
  });
});

// ─────────────────────────────────────────────────────────────

export const AuthController = {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  changePassword,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  getAllSessions,
  revokeSession,
  revokeAllSessions,
};
