import { NextFunction, Request, Response } from "express";
import z from "zod";

export const validateRequest = (zodSchema: z.ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Handle stringified data (standard in your current middleware)
      if (req.body.data && typeof req.body.data === "string") {
        req.body = JSON.parse(req.body.data);
      }

      // 2. Parse against the schema
      // We pass the full object because your schema expects { body: ... }
      const parsedResult = await zodSchema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });

      // 3. SAFE ASSIGNMENT: Update the values without overwriting the objects
      req.body = parsedResult.body;

      // Use Object.assign to modify properties instead of re-assigning the whole object
      if (parsedResult.params) Object.assign(req.params, parsedResult.params);
      if (parsedResult.query) Object.assign(req.query, parsedResult.query);

      next();
    } catch (error) {
      // This triggers your globalErrorHandler
      next(error);
    }
  };
};
