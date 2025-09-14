import { Request, Response } from "express";

import * as commentsService from "../services//comments.service";

import validateBody from "../utils/validateBody";
import pagination from "../utils/pagination";

import {
  addCommentSchema,
  updateCommentSchema,
} from "../validations/comments.schema";
import { AunthReq } from "../typescript/interfaces";

export const addCommentByPostIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(addCommentSchema, req.body);
  const { postId } = req.params;
  const result = await commentsService.addCommentByPostId(
    postId,
    req.body,
    (req as AunthReq).user
  );

  res.json(result);
};

export const updateCommentByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  await validateBody(updateCommentSchema, req.body);

  const { id: commentId } = req.params;
  const result = await commentsService.updateCommentById(
    commentId,
    req.body,
    (req as AunthReq).user
  );

  res.json(result);
};

export const deleteCommentByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: commentId } = req.params;
  const result = await commentsService.deleteCommentById(
    commentId,
    (req as AunthReq).user
  );

  res.json(result);
};

export const getCommentByPostIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { page, limit } = pagination(req.query);
  const { postId } = req.params;

  const result = await commentsService.getCommentsByPostId(postId, {
    page,
    limit,
  });

  res.json(result);
};