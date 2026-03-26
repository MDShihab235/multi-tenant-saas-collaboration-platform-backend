// ============================================================
//  Permission Module — Service
//  Project : Multi-Tenant SaaS Collaboration Platform
//  Deps    : prisma, zod
// ============================================================

import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import {
  IAssignPermissionPayload,
  ICreatePermissionPayload,
  IUpdatePermissionPayload,
} from "./permission.interface";

// ── Shared guard helpers ──────────────────────────────────────

// Ensures the caller is a member of the org — used for role-scoped
// endpoints where any org member may read, but only admins may mutate.
const requireOrgMembership = async (
  orgId: string,
  requestUser: IRequestUser,
) => {
  const membership = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: requestUser.userId },
    include: { role: true },
  });

  if (!membership) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not a member of this organization",
    );
  }

  return membership;
};

// Ensures the role exists and belongs to the given org.
// Returns the role so callers can use it without a second query.
const requireOrgRole = async (orgId: string, roleId: string) => {
  const role = await prisma.role.findFirst({
    where: { id: roleId, organizationId: orgId },
  });

  if (!role) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Role not found in this organization",
    );
  }

  return role;
};

// ── 1. Create permission — admin ──────────────────────────────
// Adds a new action + resource pair to the global permission catalog.
// The combination of action and resource must be unique across the
// platform (enforced by the @@unique constraint in the schema).
// Examples: { action: "create", resource: "project" },
//           { action: "delete", resource: "task" }
const createPermission = async (payload: ICreatePermissionPayload) => {
  const existing = await prisma.permission.findFirst({
    where: {
      action: payload.action,
      resource: payload.resource,
    },
  });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Permission "${payload.action}:${payload.resource}" already exists`,
    );
  }

  return prisma.permission.create({
    data: {
      action: payload.action,
      resource: payload.resource,
    },
  });
};

// ── 2. List all permissions — admin ───────────────────────────
// Returns the complete global permission catalog sorted by resource
// then action so related permissions group together in the response.
// Also includes the count of roles currently assigned each permission.
const getAllPermissions = async () => {
  return prisma.permission.findMany({
    orderBy: [{ resource: "asc" }, { action: "asc" }],
    include: {
      _count: {
        select: { rolePermissions: true },
      },
    },
  });
};

// ── 3. Get permission by ID — admin ───────────────────────────
// Returns a single permission's details. The rolePermissions include
// shows which org roles currently carry this permission so admins
// can assess impact before editing or deleting.
const getPermissionById = async (permId: string) => {
  const permission = await prisma.permission.findUnique({
    where: { id: permId },
    include: {
      rolePermissions: {
        include: {
          role: {
            select: {
              id: true,
              name: true,
              organization: { select: { id: true, name: true, slug: true } },
            },
          },
        },
      },
      _count: {
        select: { rolePermissions: true },
      },
    },
  });

  if (!permission) {
    throw new AppError(httpStatus.NOT_FOUND, "Permission not found");
  }

  return permission;
};

// ── 4. Update permission — admin ──────────────────────────────
// Updates the action or resource label of an existing permission.
// Checks for uniqueness conflicts on the new action+resource pair
// before writing, excluding the current record from that check.
const updatePermission = async (
  permId: string,
  payload: IUpdatePermissionPayload,
) => {
  const permission = await prisma.permission.findUnique({
    where: { id: permId },
  });

  if (!permission) {
    throw new AppError(httpStatus.NOT_FOUND, "Permission not found");
  }

  // Build the effective action/resource after the update to check uniqueness
  const newAction = payload.action ?? permission.action;
  const newResource = payload.resource ?? permission.resource;

  if (
    newAction !== permission.action ||
    newResource !== permission.resource
  ) {
    const conflict = await prisma.permission.findFirst({
      where: {
        action: newAction,
        resource: newResource,
        NOT: { id: permId },
      },
    });

    if (conflict) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Permission "${newAction}:${newResource}" already exists`,
      );
    }
  }

  return prisma.permission.update({
    where: { id: permId },
    data: {
      ...(payload.action !== undefined && { action: payload.action }),
      ...(payload.resource !== undefined && { resource: payload.resource }),
    },
  });
};

// ── 5. Delete permission — admin ──────────────────────────────
// Permanently removes a permission from the global catalog.
// The schema's onDelete: Cascade on RolePermission means all
// role assignments for this permission are automatically removed.
// Warns the caller about the number of role assignments that will
// be deleted before proceeding.
const deletePermission = async (permId: string) => {
  const permission = await prisma.permission.findUnique({
    where: { id: permId },
    include: {
      _count: { select: { rolePermissions: true } },
    },
  });

  if (!permission) {
    throw new AppError(httpStatus.NOT_FOUND, "Permission not found");
  }

  await prisma.permission.delete({ where: { id: permId } });

  return {
    deletedPermission: { id: permission.id, action: permission.action, resource: permission.resource },
    cascadedRoleAssignments: permission._count.rolePermissions,
  };
};

// ── 6. Assign permission to a role ───────────────────────────
// Creates a RolePermission pivot record linking a platform permission
// to an org-scoped role. Both the permission and the role must exist,
// and the role must belong to the specified org. The caller must be
// a member of the org — further RBAC enforcement (e.g. owner-only)
// should be layered in middleware if needed for your access policy.
const assignPermissionToRole = async (
  orgId: string,
  roleId: string,
  requestUser: IRequestUser,
  payload: IAssignPermissionPayload,
) => {
  // Guard: caller must be an org member
  await requireOrgMembership(orgId, requestUser);

  // Guard: role must exist and belong to this org
  await requireOrgRole(orgId, roleId);

  // Guard: permission must exist in the global catalog
  const permission = await prisma.permission.findUnique({
    where: { id: payload.permissionId },
  });

  if (!permission) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Permission not found in the system catalog",
    );
  }

  // Guard: prevent duplicate assignments
  const alreadyAssigned = await prisma.rolePermission.findUnique({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId: payload.permissionId,
      },
    },
  });

  if (alreadyAssigned) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Permission "${permission.action}:${permission.resource}" is already assigned to this role`,
    );
  }

  return prisma.rolePermission.create({
    data: {
      roleId,
      permissionId: payload.permissionId,
    },
    include: {
      permission: {
        select: { id: true, action: true, resource: true },
      },
      role: {
        select: { id: true, name: true },
      },
    },
  });
};

// ── 7. Remove permission from a role ─────────────────────────
// Deletes the RolePermission pivot record for the given roleId +
// permissionId pair. The caller must be a member of the org the
// role belongs to. Throws 404 if the assignment does not exist
// rather than silently succeeding — this avoids hiding typos in
// route params.
const removePermissionFromRole = async (
  orgId: string,
  roleId: string,
  permId: string,
  requestUser: IRequestUser,
) => {
  // Guard: caller must be an org member
  await requireOrgMembership(orgId, requestUser);

  // Guard: role must belong to this org
  await requireOrgRole(orgId, roleId);

  const rolePermission = await prisma.rolePermission.findUnique({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId: permId,
      },
    },
    include: {
      permission: {
        select: { action: true, resource: true },
      },
    },
  });

  if (!rolePermission) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "This permission is not assigned to the role",
    );
  }

  await prisma.rolePermission.delete({
    where: {
      roleId_permissionId: {
        roleId,
        permissionId: permId,
      },
    },
  });

  return {
    removedPermission: {
      action: rolePermission.permission.action,
      resource: rolePermission.permission.resource,
    },
  };
};

// ── 8. List permissions assigned to a role ───────────────────
// Returns all permissions the role currently holds, sorted by
// resource then action for consistent ordering. Any member of
// the org can read the role's permissions — write operations
// (assign / remove) are controlled by requireOrgMembership.
const getRolePermissions = async (
  orgId: string,
  roleId: string,
  requestUser: IRequestUser,
) => {
  // Guard: caller must be an org member
  await requireOrgMembership(orgId, requestUser);

  // Guard: role must belong to this org
  const role = await requireOrgRole(orgId, roleId);

  const rolePermissions = await prisma.rolePermission.findMany({
    where: { roleId },
    include: {
      permission: {
        select: { id: true, action: true, resource: true },
      },
    },
    orderBy: [
      { permission: { resource: "asc" } },
      { permission: { action: "asc" } },
    ],
  });

  return {
    role: {
      id: role.id,
      name: role.name,
      organizationId: role.organizationId,
    },
    permissions: rolePermissions.map((rp) => rp.permission),
    total: rolePermissions.length,
  };
};

// ─────────────────────────────────────────────────────────────

export const PermissionService = {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission,
  assignPermissionToRole,
  removePermissionFromRole,
  getRolePermissions,
};
