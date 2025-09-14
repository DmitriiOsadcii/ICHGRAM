import { Request, Response } from "express";

import * as chatService from "../services/chat.service";
import pagination from "../utils/pagination";

import { AunthReq } from "../typescript/interfaces";

export const listConversationsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await chatService.listConversations(
    (req as AunthReq).user
  );

  res.json(result);
};

export const getMessagesByConversationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const { page, limit } = pagination(req.query);

  const result = await chatService.getMessagesByConversation(id, {
    page,
    limit,
  });

  res.json(result);
};

export const startConversationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const result = await chatService.startConversation(
    req.body.userId,
    (req as AunthReq).user
  );

  res.json(result);
};