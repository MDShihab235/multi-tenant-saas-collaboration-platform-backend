// ============================================================
//  Role Module — Service
// ============================================================

import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const createRole = async (
  orgId: string,
  payload: { name: string; description?: string },
) => {
  // Check if role name already exists in this org
  const existing = await prisma.role.findFirst({
    where: { organizationId: orgId, name: payload.name },
  });
  if (existing)
    throw new AppError(
      status.CONFLICT,
      "Role name already exists in this organization",
    );

  return await prisma.role.create({
    data: {
      ...payload,
      organizationId: orgId,
    },
  });
};

const getOrgRoles = async (orgId: string) => {
  return await prisma.role.findMany({
    where: { organizationId: orgId },
    include: { _count: { select: { memberships: true } } },
  });
};

const getRoleDetails = async (orgId: string, roleId: string) => {
  const role = await prisma.role.findFirst({
    where: { id: roleId, organizationId: orgId },
    include: {
      rolePermissions: {
        include: { permission: true },
      },
    },
  });

  if (!role)
    throw new AppError(status.NOT_FOUND, "Role not found in this organization");
  return role;
};

const updateRole = async (
  orgId: string,
  roleId: string,
  payload: { name?: string; description?: string },
) => {
  const role = await prisma.role.findFirst({
    where: { id: roleId, organizationId: orgId },
  });
  if (!role) throw new AppError(status.NOT_FOUND, "Role not found");

  // Prevent renaming core system roles if you have them (e.g., OWNER, ADMIN)
  if (role.name === "OWNER" || role.name === "ADMIN") {
    throw new AppError(status.BAD_REQUEST, "System roles cannot be modified");
  }

  return await prisma.role.update({
    where: { id: roleId },
    data: payload,
  });
};

const deleteRole = async (orgId: string, roleId: string) => {
  const role = await prisma.role.findFirst({
    where: { id: roleId, organizationId: orgId },
    include: { memberships: true },
  });

  if (!role) throw new AppError(status.NOT_FOUND, "Role not found");

  // Cannot delete role if users are still assigned to it
  if (role.memberships.length > 0) {
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot delete role while members are assigned to it",
    );
  }

  return await prisma.role.delete({ where: { id: roleId } });
};

export const RoleService = {
  createRole,
  getOrgRoles,
  getRoleDetails,
  updateRole,
  deleteRole,
};
