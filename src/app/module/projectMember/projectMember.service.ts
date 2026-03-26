import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ProjectMemberRole } from "../../../generated/prisma/enums";

const getProjectMembers = async (projectId: string) => {
  return await prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });
};

const addMemberToProject = async (
  projectId: string,
  payload: { userId: string; role: ProjectMemberRole },
) => {
  const existing = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId: payload.userId } },
  });
  if (existing)
    throw new AppError(
      status.CONFLICT,
      "User is already a member of this project",
    );

  return await prisma.projectMember.create({
    data: { projectId, userId: payload.userId, role: payload.role },
  });
};

const updateMemberRole = async (
  projectId: string,
  userId: string,
  role: ProjectMemberRole,
) => {
  return await prisma.projectMember.update({
    where: { projectId_userId: { projectId, userId } },
    data: { role },
  });
};

const removeMember = async (projectId: string, userId: string) => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });

  if (member?.role === ProjectMemberRole.OWNER) {
    throw new AppError(status.BAD_REQUEST, "Project owner cannot be removed");
  }

  return await prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } },
  });
};

const leaveProject = async (userId: string, projectId: string) => {
  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });

  if (member?.role === ProjectMemberRole.OWNER) {
    throw new AppError(
      status.BAD_REQUEST,
      "Owner cannot leave. Transfer ownership or delete project.",
    );
  }

  return await prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } },
  });
};

export const ProjectMemberService = {
  getProjectMembers,
  addMemberToProject,
  updateMemberRole,
  removeMember,
  leaveProject,
};
