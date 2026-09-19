import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import HttpError from "../../utils/HttpError";
import { env } from "../../configs/env.config";
import User from "../../models/User";
import { dbQuery } from "../../middleware/error.middleware";

export const loginController = dbQuery(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new HttpError({ status: 401, message: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new HttpError({ status: 401, message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

export default loginController;
