import { Router } from "express";
import * as auth from "../controllers/auth.controller";
import authenticate from "../middlewares/authorizattion";

const authRouter: Router = Router();

authRouter.post("/register", auth.registerController);
authRouter.post("/login", auth.loginController);

// verify (POST) — если дергаешь из фронта
authRouter.post("/verify", auth.verifyEmailController);


authRouter.post("/resend-verify-email", auth.resendVerifyEmailController);

authRouter.get("/current", authenticate, auth.getCurrentController);
authRouter.post("/forgot-password", auth.forgotPasswordController);
authRouter.post("/logout", authenticate, auth.logoutController);
authRouter.post("/refresh-token", auth.refreshTokenController);

authRouter.delete("/delete-credentials", authenticate, auth.deleteCredentialsController);
authRouter.put("/change-password", authenticate, auth.changePasswordController);
authRouter.put("/change-email", authenticate, auth.changeEmailController);

export default authRouter;