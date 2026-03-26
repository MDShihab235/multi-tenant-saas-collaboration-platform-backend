// ============================================================
//  User Module — Controller
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Deps    : express, http-status
// ============================================================

import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { CookieUtils } from "../../utils/cookie";
import { UserService } from "./user.service";

// ── 1. Get own profile ────────────────────────────────────────
// GET /api/v1/users/me
// Auth : required
// Res  : 200 — full profile with memberships and owned orgs
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMyProfile(req.user);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Profile fetched successfully",
    data: result,
  });
});

// ── 2. Update own profile ─────────────────────────────────────
// PATCH /api/v1/users/me
// Auth : required
// Body : { name?, image? }
// Res  : 200 — updated profile fields
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateMyProfile(req.user, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

// ── 3. Change own password ────────────────────────────────────
// PATCH /api/v1/users/me/change-password
// Auth : required
// Body : { currentPassword, newPassword }
// Res  : 200 — fresh token pair (all other sessions revoked)
const changeOwnPassword = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session_token"];

  const result = await UserService.changeOwnPassword(
    req.user,
    req.body,
    sessionToken,
  );

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

// ── 4. Soft-delete own account ────────────────────────────────
// DELETE /api/v1/users/me
// Auth  : required
// Res   : 200 — account flagged as deleted, all cookies cleared
const deleteMyAccount = catchAsync(async (req: Request, res: Response) => {
  await UserService.deleteMyAccount(req.user);

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
    message: "Account deleted successfully",
    data: null,
  });
});

// ── 5. List all users — admin ─────────────────────────────────
// GET /api/v1/users?page=1&limit=10&status=ACTIVE&search=john
// Auth  : admin
// Query : page, limit, status, search
// Res   : 200 — paginated user list with meta
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    status: req.query.status as string | undefined,
    search: req.query.search as string | undefined,
  };

  const result = await UserService.getAllUsers(filters);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: result,
  });
});

// ── 6. Get user by ID — admin ─────────────────────────────────
// GET /api/v1/users/:userId
// Auth  : admin
// Param : userId
// Res   : 200 — full user record including memberships
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await UserService.getUserById(userId as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data: result,
  });
});

// ── 7. Update user status — admin ────────────────────────────
// PATCH /api/v1/users/:userId/status
// Auth  : admin
// Param : userId
// Body  : { status: "ACTIVE" | "INACTIVE" | "BLOCKED" }
// Res   : 200 — updated user with new status
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await UserService.updateUserStatus(userId as string, req.body);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: result,
  });
});

// ── 8. Force password change — admin ─────────────────────────
// PATCH /api/v1/users/:userId/force-password
// Auth  : admin
// Param : userId
// Res   : 200 — needPasswordChange set to true
const forcePasswordChange = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await UserService.forcePasswordChange(userId as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "User will be required to change their password on next login",
    data: result,
  });
});

// ── 9. Hard-delete user — admin ───────────────────────────────
// DELETE /api/v1/users/:userId
// Auth  : admin
// Param : userId
// Res   : 200 — user permanently removed from the database
const hardDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  await UserService.hardDeleteUser(userId as string);

  sendResponse(res, {
    httpStatusCode: httpStatus.OK,
    success: true,
    message: "User permanently deleted",
    data: null,
  });
});

// ─────────────────────────────────────────────────────────────

export const UserController = {
  getMyProfile,
  updateMyProfile,
  changeOwnPassword,
  deleteMyAccount,
  getAllUsers,
  getUserById,
  updateUserStatus,
  forcePasswordChange,
  hardDeleteUser,
};
