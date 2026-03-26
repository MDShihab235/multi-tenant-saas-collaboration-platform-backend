import { z } from "zod";

const filterLogsSchema = z.object({
  query: z.object({
    actorId: z.string().optional(),
    action: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

const purgeLogsSchema = z.object({
  body: z.object({
    days: z.number().min(1, "Must be at least 1 day"),
  }),
});

export const ActivityLogValidation = {
  filterLogsSchema,
  purgeLogsSchema,
};
