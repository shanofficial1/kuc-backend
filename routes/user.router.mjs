import { Router } from "express";

import {
  getCanEdit  
} from "../controllers/users.controller.mjs";
import authMiddleware from "../middlewares/middlewares.auth.mjs";

const   userRouter = Router();

userRouter.get(
  "/can-edit",
  authMiddleware,
  getCanEdit
);
export default userRouter;