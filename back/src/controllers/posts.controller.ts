import { Request, Response } from "express";

import * as postsService from "../services/posts.service";  

import validateBody from "../utils/validateBody";;
import HttpExeption from "../utils/HttpExeption";

import { addPostSchema, updatePostSchema } from "../validations/posts.schema";
import { PostDocument } from "../db/models/Post";
import { AunthReq } from "../typescript/interfaces";
import { IPostResponse } from "../services/posts.service";

export const addPostController = async (req: Request, res: Response) => {
  // Сначала multer уже положил req.file
  if (!req.file) {
    throw HttpExeption(400, "photo is required"); // попадёт в твой errorHandler
  }
  await validateBody(addPostSchema, req.body); // без photo
  const result = await postsService.addPost({ payload: req.body, file: req.file }, (req as AunthReq).user);
  res.json(result);
};

export const getPostsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: IPostResponse[] = await postsService.getPosts(
    (req as AunthReq).user
  );

  res.json(result);
};

export const getMyPostsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result: IPostResponse[] = await postsService.getMyPosts(
    (req as AunthReq).user
  );

  res.json(result);
};

export const getPostsByUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const result: IPostResponse[] = await postsService.getPostsByUser(
    id,
    (req as AunthReq).user
  );

  res.json(result);
};

export const getPostByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const result = await postsService.getPostById(
    id,
    (req as AunthReq).user
  );

  res.json(result);
};

export const updatePostController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(updatePostSchema, req.body);

  const { id } = req.params;
  const result = await postsService.updatePost(
    id,
    {
      payload: req.body,
      file: req.file,
    },
    (req as AunthReq).user
  );

  res.json(result);
};

export const deletePostController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const result = await postsService.deletePost(
    id,
    (req as AunthReq).user
  );

  res.json(result);
};

export const getExplorePostsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const count = 30;
  const result = await postsService.getExplorePosts(
    (req as AunthReq).user,
    count
  );

  res.json(result);
};
