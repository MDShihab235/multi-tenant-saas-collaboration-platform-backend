// ============================================================
//  Auth Module — Validation (Zod)
//  Project : Multi-Tenant SaaS Collaboration Platform
// ============================================================

import { z } from "zod";

// ── Reusable field schemas ────────────────────────────────────

const emailField = z
  .string("Email is required")
  .email("Please provide a valid email address")
  .toLowerCase()
  .trim();

const passwordField = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must not exceed 64 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must include uppercase, lowercase, and a number",
  );

const otpField = z
  .string("OTP is required")
  .length(6, "OTP must be exactly 6 digits")
  .regex(/^\d{6}$/, "OTP must contain only digits");

// ── 1. Register ───────────────────────────────────────────────
const registerSchema = z.object({
  body: z.object({
    name: z
      .string("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must not exceed 80 characters")
      .trim(),
    email: emailField,
    password: passwordField,
  }),
});

// ── 2. Login ──────────────────────────────────────────────────
const loginSchema = z.object({
  body: z.object({
    email: emailField,
    password: z.string("Password is required").min(1),
  }),
});

// ── 3. Verify email ───────────────────────────────────────────
const verifyEmailSchema = z.object({
  body: z.object({
    email: emailField,
    otp: otpField,
  }),
});

// ── 4. Resend verification ────────────────────────────────────
const resendVerificationSchema = z.object({
  body: z.object({
    email: emailField,
  }),
});

// ── 5. Forgot password ────────────────────────────────────────
const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailField,
  }),
});

// ── 6. Reset password ─────────────────────────────────────────
const resetPasswordSchema = z.object({
  body: z.object({
    email: emailField,
    otp: otpField,
    newPassword: passwordField,
  }),
});

// ── 7. Change password ────────────────────────────────────────
const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string("Current password is required").min(1),
      newPassword: passwordField,
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must differ from the current password",
      path: ["newPassword"],
    }),
});

// ─────────────────────────────────────────────────────────────

export const AuthValidation = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
