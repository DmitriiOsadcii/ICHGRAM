import * as Yup from "yup"

import { emailSchema, passwordSchema } from "./fields.schema"

export const registerSchema = Yup.object({
    email: emailSchema,
    fullName: Yup.string().trim().required(),
    username: Yup.string().trim().required(),
    password: passwordSchema
}).noUnknown(true, ({ data }) => `Unknown field: ${data}`);

export const loginSchema = Yup.object({
    email: emailSchema,
    password: passwordSchema
});

export const verifyCodeSchema = Yup.object({
    code: Yup.string().trim().required(),
}).noUnknown(true, ({ data }) => `Unknown field: ${data}`);

export const resendVerifyEmailSchema = Yup.object({
    email: emailSchema,
}).noUnknown(true, ({ unknown }) => `Unknown field: ${unknown}`);

export const changeEmailSchema = Yup.object({
    newEmail: emailSchema,
    password: passwordSchema,
}).noUnknown(true, ({ unknown }) => `Unknown field: ${unknown}`);

export const changePasswordSchema = Yup.object({
    password: passwordSchema,
    newPassword: passwordSchema,
}).noUnknown(true, ({ unknown }) => `Unknown field: ${unknown}`);

export const forgotPasswordSchema = Yup.object({
    email: emailSchema,
}).noUnknown(true, ({ unknown }) => `Unknown field: ${unknown}`);

export const deleteAccountSchema = Yup.object({
    password: passwordSchema,
}).noUnknown(true, ({ unknown }) => `Unknown field: ${unknown}`);

export type DeleteAccountSchema = Yup.InferType<typeof deleteAccountSchema>;
export type forgotPasswordSchema = Yup.InferType<typeof forgotPasswordSchema>;
export type changePasswordSchema = Yup.InferType<typeof changePasswordSchema>;
export type changeEmailSchema = Yup.InferType<typeof changeEmailSchema>;
export type resendVerifyEmailSchema = Yup.InferType<typeof resendVerifyEmailSchema>;
export type verifyCodeSchema = Yup.InferType<typeof verifyCodeSchema>;
export type loginSchema = Yup.InferType<typeof loginSchema>;
export type registerSchema = Yup.InferType<typeof registerSchema>;