import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import HttpError from "../utils/HttpError";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new HttpError({
        status: 400,
        message: result.error.issues[0].message,
      });
    }
    req.body = result.data;
    next();
  };
};
