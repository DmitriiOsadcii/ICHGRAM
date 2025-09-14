import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  forgotPasswordApi,
  loginApi,
  logoutApi,
  registerApi,
  resendEmailApi,
  verifyUserApi,
  getCurrentApi,
} from "../../shared/api/auth.api";
import { updateMyProfileApi } from "../../shared/api/myProfile.api";
import type { RootState } from "../store";
import { isAxiosError } from "axios";

import type {
  IResendVerificationEmaiPayload,
  IForgotPasswordPayload,
  IAuthResponse,
  ILoginPayload,
  IRegisterPayload,
  IUser,
  IUpdateMyProfilePayload,
} from "../../typescript/interfaces";

/** Извлекаем понятное сообщение из ошибки без использования `any` */
const extractErrorMessage = (error: unknown, fallback = "Unknown error"): string => {
  // AxiosError?
  if (isAxiosError(error)) {
    const data = error.response?.data;

    // 1) JSON с полем message
    if (data && typeof data === "object") {
      const maybeMsg = (data as { message?: unknown }).message;
      if (typeof maybeMsg === "string" && maybeMsg.trim()) return maybeMsg;
    }

    // 2) Ответ-строка
    if (typeof data === "string" && data.trim()) return data;

    // 3) Сообщение самой ошибки Axios
    if (typeof error.message === "string" && error.message.trim()) return error.message;
  }

  // Обычная JS-ошибка
  if (error instanceof Error && typeof error.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

export const registration = createAsyncThunk<
  { message: string },
  IRegisterPayload,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const data = await registerApi(payload);
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const login = createAsyncThunk<
  IAuthResponse,
  ILoginPayload,
  { rejectValue: string }
>("/auth/login", async (payload, { rejectWithValue }) => {
  try {
    const data = await loginApi(payload);
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const verify = createAsyncThunk<
  { message: string },
  { code: string },
  { rejectValue: string }
>("/auth/verify", async ({ code }, { rejectWithValue }) => {
  try {
    const data = await verifyUserApi(code);
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const resendEmail = createAsyncThunk<
  { message: string },
  IResendVerificationEmaiPayload,
  { rejectValue: string }
>("/auth/resend-verify-email", async (payload, { rejectWithValue }) => {
  try {
    const data = await resendEmailApi(payload);
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const forgotPassword = createAsyncThunk<
  { message: string },
  IForgotPasswordPayload,
  { rejectValue: string }
>("/auth/forgot-password", async (payload, { rejectWithValue }) => {
  try {
    const data = await forgotPasswordApi(payload);
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateProfile = createAsyncThunk<
  IUser,
  IUpdateMyProfilePayload,
  { rejectValue: string }
>("/auth/updateMyProfile", async (payload, { rejectWithValue }) => {
  try {
    const data = await updateMyProfileApi(payload);
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const logout = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>("/auth/logout", async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    return true;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const getCurrent = createAsyncThunk<
  IAuthResponse,
  void,
  { rejectValue: string; state: RootState }
>("auth/current", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const data = await getCurrentApi(token);
    return data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});