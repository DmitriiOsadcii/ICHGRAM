import { Request, Response } from "express";

import * as notificationsService from "../services/notifications.service";
import pagination from "../utils/pagination";

import { AunthReq } from "../typescript/interfaces";

export const getNotificationsController = async (
  req: Request,
  res: Response
): Promise<void> => {
   const { page, limit } = pagination(req.query);
  const result = await notificationsService.getNotifications(
    (req as AunthReq).user,
     { page, limit }
  );

  res.json(result);
};

export const markAsReadController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const result = await notificationsService.markAsRead(
    id,
    (req as AunthReq).user
  );

  res.json(result);
};