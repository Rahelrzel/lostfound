import { Router } from "express";
import { loginController } from "../controllers/auth/loginController";
import { registerController } from "../controllers/auth/registerController";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { validateBody } from "../middleware/validateBody.middleware";

const router = Router();

router.post("/register", validateBody(registerSchema), registerController);
router.post("/login", validateBody(loginSchema), loginController);

export default router;
