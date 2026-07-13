import { Router } from "express";
import authMiddleware from "../middlewares/middlewares.auth.mjs";

import {
  deleteMyNotifications,
  getMyNotifications,
} from "../controllers/notification.controller.mjs";

const notificationRouter = Router();



notificationRouter.get(
    "/",
    authMiddleware,
    getMyNotifications
);

notificationRouter.delete(
    "/",
    authMiddleware,
    deleteMyNotifications
);
export default notificationRouter;