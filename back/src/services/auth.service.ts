import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

import User from "../db/models/User";
import * as jswb from "../functions/jsonwebtoken";
import generateRandomPassword from "../utils/generatePassword";
import sendEmail from "../utils/sendEmail";
import HttpExeption from "../utils/HttpExeption";


import { UserDocument } from "../db/models/User";
import * as validSchema from "../validations/auth.schema";
import { ILoginResponse, IResponse, IUserFound } from "../typescript/interfaces";

const { FRONTEND_URL} = process.env;

if (!FRONTEND_URL) throw HttpExeption(500, "FRONTEND_URL is not defined in env");

// Хелпер для ссылки подтверждения (вариант без query — понятнее и сложнее промахнуться):


// Registration
export const register = async (payload: validSchema.registerSchema) => {
  const hashPassword = await bcrypt.hash(payload.password, 10);
  const verificationCode = nanoid();

  const user = await User.create({
    ...payload,
    password: hashPassword,
    verificationCode,
  });

const verifyEmail = {
  to: [user.email],
  subject: "Registration request",
  html: `
    <p>Hello ${user.fullName} ,</p>
    <p>Appreciate for your registration on ICHGRAM</p>
    <p>Please confirm your email address by clicking the link below</p>
    <p><a href="${FRONTEND_URL}?verificationCode=${verificationCode}" target="_blank">Confirm your email</a></p>
    <p>If it hasn't been you , nevermind, just change your password just in case !</p>
  `,
  text: `Hello ${user.fullName}! Please confirm: ${verificationCode}`,
};

  try {
    await sendEmail(verifyEmail);
  } catch (e) {
    console.warn("Registration: email send failed, but user created", e);
  }

  return user;
};

// EMAIL VERIFICATION (atomic update)

export const verifyEmail = async (code: validSchema.verifyCodeSchema): Promise<void> => {
    
  const user: UserDocument | null = await User.findOne({
    verificationCode: code,
  });
  if (!user) throw HttpExeption(401, "Email already verified or not found");
  user.verificationCode = "";
  user.verify = true;
  await user.save();
};

// RESENDING EMAIL FOR VERIFICATION
export const resendEmailVerify = async ({
  email,
}: validSchema.resendVerifyEmailSchema): Promise<UserDocument> => {
  const userFound: IUserFound = { email };
  const user: UserDocument | null = await User.findOne(userFound);
  if (!user) throw HttpExeption(401, `User with email ${email} is not found`);

  const verificationCode = nanoid();
  user.verificationCode = verificationCode;
  await user.save();


const resendVerifyEmail = {
  to: [user.email],
  subject: "Resending email for verification",
  html: `
    <p>Hello ${user.fullName},</p>
    <p>You recently requested a new confirmation link for your <strong>Ichgram</strong> account.</p>
    <p>Please confirm your email address by clicking the link below:</p>
    <p><a href="${FRONTEND_URL}?verificationCode=${verificationCode}" 
    <p>If you already verified your email or did not request this link, you can safely ignore this message.</p>
  `,
  text: `Confirm your email: ${verificationCode}`,
};

  await sendEmail(resendVerifyEmail);
  return user;
};

// SIGN IN
export const login = async ({
  email,
  password,
}: validSchema.loginSchema): Promise<ILoginResponse> => {
  const userFound: IUserFound = { email };
  const user: UserDocument | null = await User.findOne(userFound);
  if (!user) throw HttpExeption(401, `Email is wrong or it is not registered`);
  if (!user.verify) throw HttpExeption(401, `Email is not verified`);

  const passwordCompare: boolean = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpExeption(401, "Password invalid,  try again !");

  const token: string = jswb.createToken(user);
  const refreshToken: string = jswb.refreshTokens(user);

  user.token = token;
  user.refreshToken = refreshToken;
  await user.save();

  return {
    token,
    refreshToken,
    user: {
      email: user.email,
      fullName: user.fullName,
      username: user.username,
    },
  };
};

// FORGOT PASSWORD
export const forgotPassword = async ({
  email,
}: validSchema.forgotPasswordSchema): Promise<UserDocument> => {
  const userFound: IUserFound = { email };
  const user: UserDocument | null = await User.findOne(userFound);
  if (!user) throw HttpExeption(401, `User with this email ${email} not found`);

  const tempPassword: string = generateRandomPassword();
  const hashPassword: string = await bcrypt.hash(tempPassword, 10);
  user.password = hashPassword;
  await user.save();

  const resetPassword = {
    to: [user.email],
    subject: "Reset your password",
    html: `
      <p>Hello ${user.fullName},</p>
      <p>You requested a password reset. Here is your temporary password:</p>
      <p><strong>${tempPassword}</strong></p>
      <p>Please log in using this password and then change it in your account settings:</p>
      <p><a href="${FRONTEND_URL}" target="_blank">Log in</a></p>
      <p>If you have not requested this password, please ignore this email.</p>
    `,
    text: `Temporary password: ${tempPassword}. Log in: ${FRONTEND_URL}`,
  };

  await sendEmail(resetPassword);
  return user;
};

// REFRESH TOKEN
export const refreshToken = async (
  refreshToken: string
): Promise<{ token: string; refreshToken: string }> => {
  const id = jswb.verifyRefreshToken(refreshToken);
  const user: UserDocument | null = await User.findById(id);

  if (!user || user.refreshToken !== refreshToken)
    throw HttpExeption(403, `Invalid Token`);
  const token: string = jswb.createToken(user);
  const newRefreshToken: string = jswb.refreshTokens(user);

  user.token = token;
  user.refreshToken = newRefreshToken;
  await user.save();
  return { token, refreshToken: newRefreshToken };
};

// CHANGE PASSWORD
export const changePassword = async (
  { password, newPassword }: validSchema.changePasswordSchema,
  { _id }: UserDocument
): Promise<boolean> => {
  const user = await User.findById(_id);
  if (!user) throw HttpExeption(401, `The user with id ${_id} is not found`);

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpExeption(401, `Password invalid`);

  if (password === newPassword) {
    throw HttpExeption(
      401,
      `New password should be not the same as the current one`
    );
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashPassword;
  user.token = "";
  user.refreshToken = "";
  await user.save();
  return true;
};

export const getCurrent = async (
  user: UserDocument
): Promise<IResponse> => {
  const token: string = jswb.createToken(user);
  const refreshToken: string = jswb.refreshTokens(user);
  user.token = token;
  user.refreshToken = refreshToken;
  await user.save();

  return {
    token,
    user: {
      _id: user.id,
      email: user.email,
      fullName: user.fullName,
      username: user.username,
      profilePhoto: user.profilePhoto,
      biography: user.biography,
      webSite: user.website,
    },
  };
};



// CHANGE EMAIL
export const changeEmail = async (
  { password, newEmail }: validSchema.changeEmailSchema,
  { _id }: UserDocument
): Promise<string> => {
  const user: UserDocument | null = await User.findById(_id);
  if (!user) throw HttpExeption(401, `User with this id ${_id} is not found`);
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpExeption(403, `Password invalid`);
  if (newEmail === user.email)
    throw HttpExeption(
      400,
      `New Email must be different from the current one `
    );
  user.email = newEmail;
  user.token = "";
  user.refreshToken = "";
  await user.save();
  return user.email;
};

// LOG OUT
export const logout = async ({ _id }: UserDocument): Promise<boolean> => {
  const user: UserDocument | null = await User.findById(_id);
  if (!user) throw HttpExeption(401, `User with id ${_id} is not found`);
  user.token = "";
  user.refreshToken = "";
  await user.save();
  return true;
};

// DELETE
export const deleteAccount = async (
  { password }: validSchema.DeleteAccountSchema,
  { _id }: UserDocument
): Promise<boolean> => {
  const user = await User.findById(_id);
  if (!user) throw HttpExeption(401, `User with id ${_id} is not found`);

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpExeption(403, `Password is invalid`);

  await user.deleteOne();
  return true;
};