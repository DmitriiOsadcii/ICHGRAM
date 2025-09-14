import backendInstance from "./instance";

// import requestDecorator from "../utils/requestDecorator";


import type { IComment, IAddCommentPayload, IUpdateCommentPayload, ICommentResponse } from "../../typescript/interfaces";


export const addCommentApi = async (
  postId: string,
  payload: IAddCommentPayload
): Promise<IComment> => {
  const { data } = await backendInstance.post(
    `/comments/post/${postId}`,
    payload
  );
  return data;
};

export const getCommentsByIdApi = async (
  postId: string,
  page: number,
  limit: number = 10
): Promise<ICommentResponse> => {
  const { data } = await backendInstance.get(`/comments/post/${postId}`, {
    params: { page, limit },
  });
  return data;
};


export const updateCommentByIdApi = async (
  id: string,
  payload: IUpdateCommentPayload
): Promise<IComment> => {
  const { data } = await backendInstance.put(`/comments/${id}`, payload);
  return data;
};

export const deleteCommentByIdApi = async (id: string): Promise<IComment> => {
  const { data } = await backendInstance.delete(`/comments/${id}`);
  return data;
};


