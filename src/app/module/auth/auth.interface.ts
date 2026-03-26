// ============================================================
//  Auth Module — Interfaces
//  Project : Multi-Tenant SaaS Collaboration Platform
// ============================================================

// ── Request payloads ─────────────────────────────────────────

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  status?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IVerifyEmailPayload {
  email: string;
  otp: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// ── Token response shape ─────────────────────────────────────

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthTokens extends ITokenPair {
  sessionToken: string;
}

// ── JWT payload stored inside the token ──────────────────────

export interface ITokenPayload {
  userId: string;
  name: string;
  email: string;
  status: string;
  isDeleted: boolean;
  emailVerified: boolean;
}
