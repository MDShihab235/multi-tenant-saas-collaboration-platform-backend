// ============================================================
//  Auth Module — Service
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Deps    : better-auth, prisma, jsonwebtoken, zod
// ============================================================

import status from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { UserStatus } from "../../../generated/prisma/enums";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { auth, sendVerificationEmailOTP } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { tokenUtils } from "../../utils/token";
import {
  IAuthTokens,
  IChangePasswordPayload,
  ILoginPayload,
  IRegisterPayload,
  IResetPasswordPayload,
  ITokenPair,
} from "./auth.interface";

// ── 1. Register ───────────────────────────────────────────────
// Creates a User + Session via better-auth, then returns a JWT pair.
// No org is created here — the user must call POST /organizations later.
const register = async (payload: IRegisterPayload): Promise<IAuthTokens> => {
  const { name, email, password } = payload;

  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    throw new AppError(
      status.CONFLICT,
      "An account with this email already exists",
    );
  }

  const data = await auth.api.signUpEmail({ body: { name, email, password } });

  if (!data?.user) {
    throw new AppError(
      status.BAD_REQUEST,
      "Registration failed. Please try again",
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
  });

  const tokenPayload = {
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    status: user?.status,
    isDeleted: user?.isDeleted,
    emailVerified: data.user.emailVerified,
  };

  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken = tokenUtils.getRefreshToken(tokenPayload);

  return {
    accessToken,
    refreshToken,
    sessionToken: data.token as string,
  };
};

// ── 2. Login ──────────────────────────────────────────────────
// Validates credentials via better-auth, checks account status,
// and returns a fresh JWT pair alongside the better-auth session token.
const login = async (payload: ILoginPayload): Promise<IAuthTokens> => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({ body: { email, password } });

  if (!data?.user) {
    throw new AppError(status.UNAUTHORIZED, "Invalid email or password");
  }
  const user = await prisma.user.findUnique({
    where: { id: data.user.id },
  });
  if (user?.status === UserStatus.BLOCKED) {
    throw new AppError(
      status.FORBIDDEN,
      "Your account has been blocked. Contact support",
    );
  }

  if (user?.isDeleted || user?.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "Account no longer exists");
  }

  const tokenPayload = {
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    status: user?.status,
    isDeleted: user?.isDeleted,
    emailVerified: data.user.emailVerified,
  };

  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken = tokenUtils.getRefreshToken(tokenPayload);

  return {
    accessToken,
    refreshToken,
    sessionToken: data.token as string,
  };
};

// ── 3. Logout ─────────────────────────────────────────────────
// Revokes the better-auth session so the session token is invalidated
// on the server side. Cookies are cleared in the controller.
const logout = async (sessionToken: string): Promise<void> => {
  if (!sessionToken) {
    throw new AppError(status.BAD_REQUEST, "Session token is required");
  }

  await auth.api.signOut({
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
  });
};

// ── 4. Refresh token ──────────────────────────────────────────
// Validates the refresh token and existing better-auth session,
// then issues a new JWT pair and extends the session expiry.
const refreshToken = async (
  incomingRefreshToken: string,
  sessionToken: string,
): Promise<IAuthTokens> => {
  const session = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session) {
    throw new AppError(status.UNAUTHORIZED, "Session is expired or invalid");
  }

  if (session.expiresAt < new Date()) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Session has expired. Please log in again",
    );
  }

  const verification = jwtUtils.verifyToken(
    incomingRefreshToken,
    envVars.REFRESH_TOKEN_SECRET,
  );

  if (!verification.success || !verification.data) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Refresh token is invalid or expired",
    );
  }

  const decoded = verification.data as JwtPayload;
  const user = session.user;

  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "Account no longer exists");
  }

  const tokenPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified,
  };

  const newAccessToken = tokenUtils.getAccessToken(tokenPayload);
  const newRefreshToken = tokenUtils.getRefreshToken(tokenPayload);

  // Extend session lifetime by 24 hours
  const updatedSession = await prisma.session.update({
    where: { token: sessionToken },
    data: { expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: updatedSession.token,
  };
};

// ── 5. Get me ─────────────────────────────────────────────────
// Returns the full authenticated user record with all org memberships.
const getMe = async (requestUser: IRequestUser) => {
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
      ownedOrganizations: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new AppError(status.GONE, "This account has been deleted");
  }

  return user;
};

// ── 6. Change password ────────────────────────────────────────
// Validates the current password via better-auth then updates it.
// If needPasswordChange was set (e.g. admin-forced), it is cleared.
const changePassword = async (
  payload: IChangePasswordPayload,
  sessionToken: string,
): Promise<IAuthTokens> => {
  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
  });

  if (!session?.user) {
    throw new AppError(status.UNAUTHORIZED, "Session is invalid or expired");
  }

  const { currentPassword, newPassword } = payload;

  if (currentPassword === newPassword) {
    throw new AppError(
      status.BAD_REQUEST,
      "New password must be different from current password",
    );
  }

  await auth.api.changePassword({
    body: { currentPassword, newPassword, revokeOtherSessions: true },
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` }),
  });
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.needPasswordChange) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { needPasswordChange: false },
    });
  }

  const tokenPayload = {
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    status: user?.status,
    isDeleted: user?.isDeleted,
    emailVerified: session.user.emailVerified,
  };

  return {
    accessToken: tokenUtils.getAccessToken(tokenPayload),
    refreshToken: tokenUtils.getRefreshToken(tokenPayload),
    sessionToken,
  };
};

// ── 7. Verify email ───────────────────────────────────────────
// Validates OTP from the Verification table via better-auth and
// flips emailVerified to true on the User record.
const verifyEmail = async (email: string, otp: string): Promise<void> => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "No account found with this email");
  }

  if (user.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "Email is already verified");
  }

  await auth.api.verifyEmailOTP({ body: { email, otp } });

  await prisma.user.updateMany({
    where: { email },
    data: { emailVerified: true },
  });
};

// ── 8. Resend verification email ──────────────────────────────
// Re-triggers the OTP email if the user's email is not yet verified.
const resendVerificationEmail = async (email: string): Promise<void> => {
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "No account found with this email");
  }

  if (user.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "Email is already verified");
  }

  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "Account not found");
  }

  await sendVerificationEmailOTP({ body: { email } });
};

// ── 9. Forgot password ────────────────────────────────────────
// Sends a password-reset OTP to the email via better-auth.
// Fails silently on non-existent email to prevent user enumeration.
const forgotPassword = async (email: string): Promise<void> => {
  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    // Return without error to prevent email enumeration
    return;
  }

  if (!user.emailVerified) {
    throw new AppError(
      status.BAD_REQUEST,
      "Please verify your email address first",
    );
  }

  if (user.isDeleted || user.status === UserStatus.DELETED) {
    return;
  }

  await auth.api.requestPasswordResetEmailOTP({ body: { email } });
};

// ── 10. Reset password ────────────────────────────────────────
// Validates OTP and sets the new password. All sessions are revoked
// after a successful reset for security.
const resetPassword = async (payload: IResetPasswordPayload): Promise<void> => {
  const { email, otp, newPassword } = payload;

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "No account found with this email");
  }

  if (!user.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "Email is not verified");
  }

  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "Account not found");
  }

  await auth.api.resetPasswordEmailOTP({
    body: { email, otp, password: newPassword },
  });

  // Clear needPasswordChange flag if it was set
  if (user.needPasswordChange) {
    await prisma.user.update({
      where: { id: user.id },
      data: { needPasswordChange: false },
    });
  }

  // Revoke all active sessions after password reset (security best practice)
  await prisma.session.deleteMany({ where: { userId: user.id } });
};

// ── 11. Get all sessions ──────────────────────────────────────
// Lists all active (non-expired) sessions for the current user.
const getAllSessions = async (userId: string) => {
  const sessions = await prisma.session.findMany({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      token: false, // never expose raw session token
      ipAddress: true,
      userAgent: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return sessions;
};

// ── 12. Revoke single session ─────────────────────────────────
// Deletes a specific session by its ID. Only the owning user's sessions
// can be deleted — enforced by scoping the query to userId.
const revokeSession = async (
  userId: string,
  sessionId: string,
): Promise<void> => {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId },
  });

  if (!session) {
    throw new AppError(status.NOT_FOUND, "Session not found");
  }

  await prisma.session.delete({ where: { id: sessionId } });
};

// ── 13. Revoke all sessions ───────────────────────────────────
// Signs out from all devices by deleting every session for the user.
const revokeAllSessions = async (
  userId: string,
): Promise<{ count: number }> => {
  const result = await prisma.session.deleteMany({ where: { userId } });
  return { count: result.count };
};

// ─────────────────────────────────────────────────────────────

export const AuthService = {
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
