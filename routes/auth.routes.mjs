import { login, register, ResetPassword,changePassword } from "../controllers/auth.controller.mjs";
import { Router } from "express";
import authMiddleware, { checkAuth } from "../middlewares/middlewares.auth.mjs";import { validatePassword } from "../middlewares/middlewares.passwordvalidator.mjs";
import { verifyOTP } from "../utils/verifyOTP.mjs";


const authRouter = Router()
authRouter.post("/register", validatePassword, register);
authRouter.post("/login", login);
authRouter.post("/reset-password", authMiddleware, validatePassword, ResetPassword);
authRouter.post("/change-password", validatePassword, changePassword);
authRouter.post("/verify-otp", verifyOTP);
authRouter.get("/check-auth", authMiddleware, checkAuth);

export default authRouter;