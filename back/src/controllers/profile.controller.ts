import { Request, Response } from "express";
import * as profile from "../services/profile.service"
import HttpExeption from "../utils/HttpExeption";
import validateBody from "../utils/validateBody";
import { updateUserSchema } from "../validations/user.schema";
import { AunthReq } from "../typescript/interfaces";
import { PublicUserResponse } from "../db/models/User";

export const getProfileController = async (req: Request, res: Response): Promise<void> => {
    const result: PublicUserResponse = await profile.getProfile((req as AunthReq).user)
    res.json(result)
}

export const updateProfileController = async (req: Request, res: Response): Promise<void> => {
    await validateBody(updateUserSchema, req.body)

    const result: PublicUserResponse = await profile.updateProfile({ payload: req.body, file: req.file }, (req as AunthReq).user)

    res.json(result)
}