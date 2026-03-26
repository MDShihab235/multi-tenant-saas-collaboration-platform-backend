// ============================================================
//  Invitation Module — Service
// ============================================================

import status from "http-status";
import crypto from "crypto";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const sendInvitation = async (
  inviterId: string,
  orgId: string,
  payload: { email: string; roleId: string },
) => {
  // 1. Check if user is already a member
  const existingMember = await prisma.membership.findFirst({
    where: { organizationId: orgId, user: { email: payload.email } },
  });
  if (existingMember)
    throw new AppError(status.CONFLICT, "User is already a member");

  // 2. Generate secure token and expiry (e.g., 7 days)
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const invitation = await prisma.invitation.create({
    data: {
      email: payload.email,
      organizationId: orgId,
      inviterId: inviterId,
      roleId: payload.roleId,
      token,
      expiresAt,
      status: "PENDING",
    },
  });

  // Note: Here you would typically trigger an email utility
  // await emailUtils.sendInvitationEmail(payload.email, token);

  return invitation;
};

const getOrgInvitations = async (orgId: string) => {
  return await prisma.invitation.findMany({
    where: { organizationId: orgId, status: "PENDING" },
    include: { inviter: { select: { name: true } }, role: true },
  });
};

const revokeInvitation = async (actorId: string, invitationId: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  });
  if (!invitation) throw new AppError(status.NOT_FOUND, "Invitation not found");

  // Only the inviter or org admin should revoke (simplified check)
  return await prisma.invitation.delete({ where: { id: invitationId } });
};

const verifyInvitationToken = async (token: string) => {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { organization: { select: { name: true } } },
  });

  if (!invitation)
    throw new AppError(status.NOT_FOUND, "Invalid invitation token");
  if (!invitation.expiresAt || invitation.expiresAt < new Date())
    throw new AppError(status.GONE, "Invitation expired");
  if (invitation.status !== "PENDING")
    throw new AppError(status.BAD_REQUEST, "Invitation already processed");

  return invitation;
};

const acceptInvitation = async (token: string) => {
  const invitation = await verifyInvitationToken(token);

  // Find user by email (User must exist/be registered to accept)
  const user = await prisma.user.findUnique({
    where: { email: invitation.email },
  });
  if (!user)
    throw new AppError(
      status.NOT_FOUND,
      "Please register an account with this email first",
    );

  return await prisma.$transaction(async (tx) => {
    // 1. Create Membership
    const membership = await tx.membership.create({
      data: {
        userId: user.id,
        organizationId: invitation.organizationId,
        roleId: invitation.roleId,
      },
    });

    // 2. Mark invitation as accepted
    await tx.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });

    return membership;
  });
};

const declineInvitation = async (token: string) => {
  const invitation = await verifyInvitationToken(token);
  return await prisma.invitation.update({
    where: { id: invitation.id },
    data: { status: "DECLINED" },
  });
};

export const InvitationService = {
  sendInvitation,
  getOrgInvitations,
  revokeInvitation,
  verifyInvitationToken,
  acceptInvitation,
  declineInvitation,
};
