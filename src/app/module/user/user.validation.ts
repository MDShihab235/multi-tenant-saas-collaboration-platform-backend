// ============================================================
//  User Module — Validation (Zod)
//  Project : Multi-Tenant SaaS Collaboration Platform
// ============================================================

import { z } from "zod";

// ── Reusable field schemas ────────────────────────────────────

const passwordField = z
  .string("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must not exceed 64 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must include uppercase, lowercase, and a number",
  );

// ── 1. Update own profile ─────────────────────────────────────
// PATCH /api/v1/users/me
const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must not exceed 80 characters")
      .trim()
      .optional(),
    image: z
      .string()
      .url("Image must be a valid URL")
      .optional(),
  }),
});

// ── 2. Change own password ────────────────────────────────────
// PATCH /api/v1/users/me/change-password
const changeOwnPasswordSchema = z.object({
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

// ── 3. Update user status — admin ─────────────────────────────
// PATCH /api/v1/users/:userId/status
const updateUserStatusSchema = z.object({
  body: z.object({
    status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"], {
      required_error: "Status is required",
      message: "Status must be ACTIVE, INACTIVE, or BLOCKED",
    }),
  }),
});

// ─────────────────────────────────────────────────────────────

export const UserValidation = {
  updateProfileSchema,
  changeOwnPasswordSchema,
  updateUserStatusSchema,
};
