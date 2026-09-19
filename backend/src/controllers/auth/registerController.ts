import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import HttpError from "../../utils/HttpError";
import { env } from "../../configs/env.config";
import User from "../../models/User";
import { dbQuery } from "../../middleware/error.middleware";

export const registerController = dbQuery(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpError({ status: 400, message: "Email already in use" });
    }

    const user = await User.create({ name, email, password });

    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  },
);

export default registerController;
