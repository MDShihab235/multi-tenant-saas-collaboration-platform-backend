import { z } from "zod";

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().max(500).optional(),
  }),
});

export const ProjectValidation = {
  createProjectSchema,
  updateProjectSchema,
};
