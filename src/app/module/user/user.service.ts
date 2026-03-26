// ============================================================
//  User Module — Service
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Deps    : better-auth, prisma, zod
// ============================================================

import httpStatus from "http-status";
import { UserStatus } from "../../generated/prisma";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { IRequestUser } from "../interfaces/requestUser.interface";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { tokenUtils } from "../utils/token";
import {
  IChangeOwnPasswordPayload,
  IUpdateProfilePayload,
  IUpdateUserStatusPayload,
  IUserFilter,
} from "./user.interface";

// ── 1. Get own profile ────────────────────────────────────────
// Returns the full authenticated user record, including all org
// memberships with their roles and all org ownerships.
// Excludes password, raw session tokens, and account credentials.
const getMyProfile = async (requestUser: IRequestUser) => {
  const user = await prisma.user.findUnique({
    where: { id: requestUser.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      status: true,
      needPasswordChange: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      memberships: {
        include: {
          organization: { select: { id: true, name: true, slug: true } },
          role: { select: { id: true, name: true } },
        },
      },
      ownedOrganizations: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.GONE, "This account has been deleted");
  }

  return user;
};

// ── 2. Update own profile ─────────────────────────────────────
// Allows the authenticated user to update their display name and
// avatar URL. Email changes require a separate verification flow.
// Password changes use the dedicated change-password endpoint.
const updateMyProfile = async (
  requestUser: IRequestUser,
  payload: IUpdateProfilePayload,
) => {
  const user = await prisma.user.findUnique({
    where: { id: requestUser.userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.GONE, "This account has been deleted");
  }

  const updatedUser = await prisma.user.update({
    where: { id: requestUser.userId },
    data: {
      ...(payload.name !== undefined && { name: payload.name }),
      ...(payload.image !== undefined && { image: payload.image }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      status: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// ── 3. Change own password ────────────────────────────────────
// Validates the current password via better-auth before updating.
// All other sessions are revoked after a successful change.
// If needPasswordChange was set by an admin, it is cleared here.
const changeOwnPassword = async (
  requestUser: IRequestUser,
  payload: IChangeOwnPasswordPayload,
  sessionToken: string,
) => {
  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
  });

  if (!session?.user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Session is invalid or expired");
  }

  const { currentPassword, newPassword } = payload;

  if (currentPassword === newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "New password must be different from your current password",
    );
  }

  await auth.api.changePassword({
    body: { currentPassword, newPassword, revokeOtherSessions: true },
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
  });

  // Clear the admin-forced flag if it was set
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { needPasswordChange: false },
    });
  }

  const tokenPayload = {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  };

  return {
    accessToken: tokenUtils.getAccessToken(tokenPayload),
    refreshToken: tokenUtils.getRefreshToken(tokenPayload),
    sessionToken,
  };
};

// ── 4. Soft-delete own account ────────────────────────────────
// Marks the user as deleted by setting isDeleted + deletedAt.
// Status is set to DELETED and all active sessions are revoked.
// The DB record is preserved for audit purposes — hard-delete
// is admin-only via DELETE /api/v1/users/:userId.
const deleteMyAccount = async (requestUser: IRequestUser) => {
  const user = await prisma.user.findUnique({
    where: { id: requestUser.userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.GONE, "Account has already been deleted");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: requestUser.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    }),
    prisma.session.deleteMany({
      where: { userId: requestUser.userId },
    }),
  ]);
};

// ── 5. List all users — admin ─────────────────────────────────
// Returns a paginated list of all platform users.
// Supports filtering by status and full-text search on name + email.
// Hard-deleted users (isDeleted = true) are excluded by default.
const getAllUsers = async (filters: IUserFilter) => {
  const { page = 1, limit = 10, status, search } = filters;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isDeleted: false };

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        status: true,
        emailVerified: true,
        needPasswordChange: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ── 6. Get user by ID — admin ─────────────────────────────────
// Returns any user's full profile including all org memberships.
// Intended for admin inspection — does not guard on isDeleted so
// admins can view soft-deleted accounts if needed.
const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      status: true,
      emailVerified: true,
      needPasswordChange: true,
      isDeleted: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
      memberships: {
        include: {
          organization: { select: { id: true, name: true, slug: true } },
          role: { select: { id: true, name: true } },
        },
      },
      ownedOrganizations: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

// ── 7. Update user status — admin ────────────────────────────
// Changes a user's status to ACTIVE, INACTIVE, or BLOCKED.
// BLOCKED users receive a 403 on their next login attempt.
// Cannot change the status of a soft-deleted account.
const updateUserStatus = async (
  userId: string,
  payload: IUpdateUserStatusPayload,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new AppError(
      httpStatus.GONE,
      "Cannot change status of a deleted account",
    );
  }

  if (user.status === payload.status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User status is already ${payload.status}`,
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { status: payload.status as UserStatus },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// ── 8. Force password change — admin ─────────────────────────
// Sets needPasswordChange = true on the target user.
// Middleware on protected routes should redirect the user to the
// change-password flow before allowing further actions.
const forcePasswordChange = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new AppError(
      httpStatus.GONE,
      "Cannot update a deleted account",
    );
  }

  if (user.needPasswordChange) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "User is already required to change their password",
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { needPasswordChange: true },
    select: {
      id: true,
      name: true,
      email: true,
      needPasswordChange: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

// ── 9. Hard-delete user — admin ───────────────────────────────
// Permanently removes the user record from the database.
// All related data (sessions, memberships, tasks, etc.) is
// cascade-deleted as defined by the schema's onDelete rules.
// This action is irreversible — prefer soft-delete for general use.
const hardDeleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  await prisma.user.delete({ where: { id: userId } });
};

// ─────────────────────────────────────────────────────────────

export const UserService = {
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
