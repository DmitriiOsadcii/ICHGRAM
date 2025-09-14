import { Router } from "express";

import * as userContr from "../controllers/user.controller";
import authenticate from "../middlewares/authorizattion";

const userRouter = Router()

userRouter.get("/search", authenticate, userContr.searchUsersController);
userRouter.get("/followers", authenticate, userContr.getFollowersController);
userRouter.get("/following", authenticate, userContr.getFollowingController);


userRouter.get("/:id/followers", authenticate, userContr.getFollowersController);
userRouter.get("/:id/following", authenticate, userContr.getFollowingController);
userRouter.get("/:id", authenticate, userContr.getUserByIdController);

userRouter.get("/", authenticate, userContr.getUsersController);


export default userRouter;