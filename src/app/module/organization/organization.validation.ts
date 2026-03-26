// ============================================================
//  Organization Module — Validation (Zod)
//  Project : Multi-Tenant SaaS Collaboration Platform
// ============================================================

import { z } from "zod";

// ── Reusable field schemas ────────────────────────────────────

const slugField = z
  .string("Slug is required")
  .min(2, "Slug must be at least 2 characters")
  .max(60, "Slug must not exceed 60 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug may only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen",
  );

// ── 1. Create organization ────────────────────────────────────
// POST /api/v1/organizations
const createOrganizationSchema = z.object({
  body: z.object({
    name: z
      .string("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .trim(),
    slug: slugField,
  }),
});

// ── 2. Update organization ────────────────────────────────────
// PATCH /api/v1/organizations/:orgId
const updateOrganizationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters")
      .trim()
      .optional(),
    slug: slugField.optional(),
  }),
});

// ─────────────────────────────────────────────────────────────

export const OrganizationValidation = {
  createOrganizationSchema,
  updateOrganizationSchema,
};
