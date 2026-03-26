import { ProjectMemberRole } from "../../../generated/prisma/enums";

export interface IAddProjectMemberPayload {
  userId: string;
  role: ProjectMemberRole;
}

export interface IUpdateProjectMemberRolePayload {
  role: ProjectMemberRole;
}
