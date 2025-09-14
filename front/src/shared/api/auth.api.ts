import backendInstance from "./instance";
import type { 
  IAuthResponse, 
  IResendVerificationEmaiPayload, 
  IForgotPasswordPayload, 
  ILoginPayload, 
  IRegisterPayload 
} from "../../typescript/interfaces";


// REGISTER
export const registerApi = async (
  payload: IRegisterPayload
): Promise<{ message: string }> => {
  const { data } = await backendInstance.post("auth/register", payload);
  return data;
};

// LOGIN
export const loginApi = async (
  payload: ILoginPayload
): Promise<IAuthResponse> => {
  const { data } = await backendInstance.post("/auth/login", payload);
  backendInstance.defaults.headers["Authorization"] = `Bearer ${data.token}`;
  return data;
};

// VERIFY (POST-верификация по коду — опционально, если используешь страницу)
export const verifyUserApi = async (
  code: string
): Promise<{ message: string }> => {
  const { data } = await backendInstance.post("/auth/verify", { code });
  return data;
};

// FORGOT PASSWORD
export const forgotPasswordApi = async (
  payload: IForgotPasswordPayload
): Promise<{ message: string }> => {
  const { data } = await backendInstance.post("auth/forgot-password", payload);
  return data;
};

// RESEND VERIFY  ✅ Путь приведён к бэку
export const resendEmailApi = async (
  payload: IResendVerificationEmaiPayload
): Promise<{ message: string }> => {
  const { data } = await backendInstance.post("auth/resend-verify-email", payload);
  return data;
};

// LOGOUT
export const logoutApi = async (): Promise<{ message: string }> => {
  const { data } = await backendInstance.post("/auth/logout");
  delete backendInstance.defaults.headers["Authorization"];
  return data;
};




export const getCurrentApi = async (
  token: string
): Promise<Omit<IAuthResponse, "refreshToken">> => {
  backendInstance.defaults.headers["Authorization"] = `Bearer ${token}`;

  try {
    const { data } = await backendInstance.get("/auth/current");
    backendInstance.defaults.headers["Authorization"] = `Bearer ${data.token}`;
    return data;
  } catch (error) {
    delete backendInstance.defaults.headers["Authorization"];
    throw error;
  }
};

