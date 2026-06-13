import { Router } from "express";
import { searchUser, searchUserById } from "../controllers/search.controller.mjs";


const searchRouter = Router();

searchRouter.get("/users", searchUser)
searchRouter.get("/users/:id", searchUserById)

export default searchRouter;