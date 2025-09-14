import backendInstance from "./instance";

// import requestDecorator from "../utils/requestDecorator";


import type { IFollowStatusResponse } from "../../typescript/interfaces";

export const followApi = async (
  targetId: string
): Promise<IFollowStatusResponse> => {
  const { data } = await backendInstance.post(`/follow/${targetId}`);
  return data;
};

export const unfollowApi = async (
  targetId: string
): Promise<IFollowStatusResponse> => {
  const { data } = await backendInstance.delete(`/follow/${targetId}`);
  return data;
};
