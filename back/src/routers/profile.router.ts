import { Router } from "express";
import * as profile from "../controllers/profile.controller"
import upload from "../middlewares/upload";
import authenticate from "../middlewares/authorizattion";

const profileRouter = Router()

profileRouter.get('/', authenticate, profile.getProfileController)
profileRouter.put('/', authenticate, upload.single("profilePhoto"), profile.updateProfileController)

export default profileRouter;