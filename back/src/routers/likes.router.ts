import { Router } from "express";

import authenticate from "../middlewares/authorizattion";
import { toggleLikeController } from "../controllers/likes.controller";

const likesRouter: Router = Router();

likesRouter.post("/toggle", authenticate, toggleLikeController);

export default likesRouter;