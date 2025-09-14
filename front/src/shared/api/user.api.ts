import backendInstance from "./instance";
// import requestDecorator from "../utils/requestDecorator";

import type { IUser, ISearchResultPayload } from "../../typescript/interfaces";

export const getUserByIdApi = async (id: string): Promise<IUser> => {
  const { data } = await backendInstance.get(`/users/${id}`);
  return data;
};


export const getUsersApi = async (
  q: string,
  page: number = 1,
  limit: number = 20
): Promise<ISearchResultPayload> => {
  const { data } = await backendInstance.get(`/users/search`, {
    params: { q, page, limit },
  });
  return data;
};

export const listUsersApi = async (): Promise<IUser[]> => {
  const { data } = await backendInstance.get(`/users/`);
  return data;
};
