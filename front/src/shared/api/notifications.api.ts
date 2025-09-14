import backendInstance from "./instance";
// import requestDecorator from "../utils/requestDecorator";


import type { IGetNotific } from "../../typescript/interfaces";

export const getNotificationApi = async (
  page: number = 1,
  limit: number = 10
): Promise<IGetNotific> => {
  const { data } = await backendInstance.get("/notifications", {
    params: { page, limit },
  });
  return data;
};

