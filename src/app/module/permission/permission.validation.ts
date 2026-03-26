// ============================================================
//  Permission Module — Validation (Zod)
//  Project : Multi-Tenant SaaS Collaboration Platform
// ============================================================

import { z } from "zod";

// ── Reusable field schemas ────────────────────────────────────

// action examples: "create", "read", "update", "delete", "manage"
const actionField = z
  .string("Action is required")
  .min(2, "Action must be at least 2 characters")
  .max(50, "Action must not exceed 50 characters")
  .regex(
    /^[a-z]+(?:_[a-z]+)*$/,
    "Action may only contain lowercase letters and underscores",
  );

// resource examples: "project", "task", "organization", "api_key"
const resourceField = z
  .string("Resource is required")
  .min(2, "Resource must be at least 2 characters")
  .max(50, "Resource must not exceed 50 characters")
  .regex(
    /^[a-z]+(?:_[a-z]+)*$/,
    "Resource may only contain lowercase letters and underscores",
  );

// ── 1. Create permission — admin ──────────────────────────────
// POST /api/v1/permissions
const createPermissionSchema = z.object({
  body: z.object({
    action: actionField,
    resource: resourceField,
  }),
});

// ── 2. Update permission — admin ──────────────────────────────
// PATCH /api/v1/permissions/:permId
const updatePermissionSchema = z.object({
  body: z.object({
    action: actionField.optional(),
    resource: resourceField.optional(),
  }),
});

// ── 3. Assign permission to a role ───────────────────────────
// POST /api/v1/permissions/:orgId/:roleId/assign
const assignPermissionSchema = z.object({
  body: z.object({
    permissionId: z
      .string("Permission ID is required")
      .cuid("Invalid permission ID format"),
  }),
});

// ─────────────────────────────────────────────────────────────

export const PermissionValidation = {
  createPermissionSchema,
  updatePermissionSchema,
  assignPermissionSchema,
};
