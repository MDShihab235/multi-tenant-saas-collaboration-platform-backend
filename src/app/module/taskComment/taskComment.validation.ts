import { z } from "zod";

const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Comment content cannot be empty").max(1000),
  }),
});

const updateCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Updated content cannot be empty").max(1000),
  }),
});

export const TaskCommentValidation = {
  createCommentSchema,
  updateCommentSchema,
};
