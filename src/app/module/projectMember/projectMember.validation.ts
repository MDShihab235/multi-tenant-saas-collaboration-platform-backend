import { z } from "zod";
import { ProjectMemberRole } from "../../../generated/prisma/enums";

const addMemberSchema = z.object({
  body: z.object({
    userId: z.string("User ID is required"),
    role: z.nativeEnum(ProjectMemberRole, "Valid role is required"),
  }),
});

const updateRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(ProjectMemberRole, "Valid role is required"),
  }),
});

export const ProjectMemberValidation = {
  addMemberSchema,
  updateRoleSchema,
};
