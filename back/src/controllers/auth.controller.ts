import { Request, Response } from "express";

import * as authService from "../services/auth.service";
import validateBody from "../utils/validateBody";
import HttpExeption from "../utils/HttpExeption";
import * as validSchema from "../validations/auth.schema";
import { UserDocument } from "../db/models/User";
import { AunthReq } from "../typescript/interfaces";
import { ILoginResponse, IResponse } from "../typescript/interfaces";

// REGISTRATION
export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(validSchema.registerSchema, req.body);
  await authService.register(req.body);
  res.status(201).json({
    message:
      "You have successfully registered. Please confirm your email by clicking the link we sent to your inbox.",
  });
};

// EMAIL VERIFICATION (POST)
export const verifyEmailController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(validSchema.verifyCodeSchema, req.body); // { code: string }
  await authService.verifyEmail(req.body.code); // pass { code }
  res.json({ message: "Email has been successfully verified . Please sign in" });
};

// RESEND VERIFY
export const resendVerifyEmailController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(validSchema.resendVerifyEmailSchema, req.body); // { email: string }
  await authService.resendEmailVerify(req.body);
  res.json({ message: "Verification email has been resent again " });
};

// USER LOG IN
export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(validSchema.loginSchema, req.body);

  const result: ILoginResponse = await authService.login(req.body);
  const token = result.token;
  const refreshToken = result.refreshToken;
  const user = result.user;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  res.json({ token, user });
};

// Forgot Password
export const forgotPasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(validSchema.forgotPasswordSchema, req.body);
  const result: UserDocument = await authService.forgotPassword(req.body);
  res.json({
    message: `Email with temporary password has been sent on your email !`,
  });
};

export const getCurrentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: IResponse = await authService.getCurrent(
    (req as AunthReq).user
  );

  const token = result.token;
  const user = result.user;

  res.json({ token, user });
};

// Change Password
export const changePasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(validSchema.changePasswordSchema, req.body);
  await authService.changePassword(req.body, (req as AunthReq).user);
  res.json({ message: `Password successfully changed !` });
};

// Change Email
export const changeEmailController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(validSchema.changeEmailSchema, req.body);
  const result = await authService.changeEmail(req.body, (req as AunthReq).user);
  res.json({ message: `Email has been successfully changed` });
};

// Log out
export const logoutController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await authService.logout((req as AunthReq).user);
  res.json({ message: `Log out successfully !` });
};

// DELETE CREDENTIALS
export const deleteCredentialsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(validSchema.deleteAccountSchema, req.body);
  await authService.deleteAccount(req.body, (req as AunthReq).user);
  res.json({ message: `Credentials have been successfully deleted ` });
};

// Refresh TOKEN
export const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const oldToken = req.cookies?.refreshToken;
  if (!oldToken) throw HttpExeption(401, `Refresh token is missing !`);

  const { token, refreshToken } = await authService.refreshToken(oldToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ token });
};

// EMAIL VERIFICATION (GET with redirect)
export const verifyEmailByGetController = async (req: Request, res: Response) => {
  // поддержим оба варианта: /verify/:code и /verify?code=...
  const code = String((req.params.code || req.query.code || "")).trim();
  const home = process.env.FRONTEND_URL || "/";

  if (!code) {
    return res.redirect(home); // нет кода — просто на главную
  }

  try {
    await authService.verifyEmail({ code });  // <-- здесь выставляется verify=true
    // УСПЕХ: на главную без лишних параметров
    return res.redirect(home);
  } catch {
    // НЕУСПЕХ: тоже на главную (можно добавить маркер, если захочешь показать баннер)
    return res.redirect(`${home}?verified=0`);
  }
};