import { Router } from "express";
import { requestAccess, approveEdit } from "../controllers/RequestAccess.controller.mjs";
import authMiddleware from "../middlewares/middlewares.auth.mjs";


const requestAccessRouter = Router();

requestAccessRouter.post("/request-access", authMiddleware,requestAccess)
requestAccessRouter.post("/approve-request", authMiddleware, approveEdit)


export default requestAccessRouter;