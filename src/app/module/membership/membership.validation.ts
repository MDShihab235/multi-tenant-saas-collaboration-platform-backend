import { z } from "zod";

const updateRoleSchema = z.object({
  body: z.object({
    roleId: z.string("Role ID is required"),
  }),
});

export const MembershipValidation = {
  updateRoleSchema,
};
