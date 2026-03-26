// ============================================================
//  Membership Module — Service
// ============================================================

import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const getOrganizationMembers = async (orgId: string) => {
  return await prisma.membership.findMany({
    where: { organizationId: orgId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      role: { select: { id: true, name: true } },
    },
  });
};

const getMemberDetails = async (orgId: string, userId: string) => {
  const member = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: userId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      role: { include: { rolePermissions: { include: { permission: true } } } },
    },
  });
  if (!member) throw new AppError(status.NOT_FOUND, "Membership not found");
  return member;
};

const updateMemberRole = async (
  actorId: string,
  orgId: string,
  targetUserId: string,
  newRoleId: string,
) => {
  // Check if actor has permission (simplified: must be Org Owner or Admin)
  const actor = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: actorId },
    include: { role: true },
  });

  if (!actor || (actor.role.name !== "ADMIN" && actor.role.name !== "OWNER")) {
    throw new AppError(
      status.FORBIDDEN,
      "Insufficient permissions to change roles",
    );
  }

  return await prisma.membership.update({
    where: {
      userId_organizationId: { organizationId: orgId, userId: targetUserId },
    },
    data: { roleId: newRoleId },
    include: { role: true },
  });
};

const removeMember = async (
  actorId: string,
  orgId: string,
  targetUserId: string,
) => {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  if (org?.ownerId === targetUserId) {
    throw new AppError(
      status.BAD_REQUEST,
      "Organization owner cannot be removed",
    );
  }

  // Ensure actor is authorized
  const actor = await prisma.membership.findFirst({
    where: { organizationId: orgId, userId: actorId },
  });
  if (!actor) throw new AppError(status.FORBIDDEN, "Access denied");

  return await prisma.membership.delete({
    where: {
      userId_organizationId: { organizationId: orgId, userId: targetUserId },
    },
  });
};

const leaveOrganization = async (userId: string, orgId: string) => {
  const org = await prisma.organization.findUnique({ where: { id: orgId } });

  if (org?.ownerId === userId) {
    throw new AppError(
      status.BAD_REQUEST,
      "Owners cannot leave. Transfer ownership first.",
    );
  }

  return await prisma.membership.delete({
    where: { userId_organizationId: { organizationId: orgId, userId: userId } },
  });
};

export const MembershipService = {
  getOrganizationMembers,
  getMemberDetails,
  updateMemberRole,
  removeMember,
  leaveOrganization,
};
