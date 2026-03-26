import { z } from "zod";

const sendInvitationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    roleId: z.string().cuid().or(z.string().uuid()),
  }),
});

const tokenActionSchema = z.object({
  body: z.object({
    token: z.string().min(10),
  }),
});

export const InvitationValidation = {
  sendInvitationSchema,
  tokenActionSchema,
};
