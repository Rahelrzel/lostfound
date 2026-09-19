import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import User, { type IUser } from "../models/User";
import { env } from "../configs/env.config";
import HttpError from "../utils/HttpError";

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

export const authenticateUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new HttpError({ status: 401, message: "Unauthorized" }));
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    next(new HttpError({ status: 401, message: "Unauthorized" }));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as unknown as {
      id: string;
    };

    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    next(new HttpError({ status: 401, message: "Invalid token" }));
  }
};
