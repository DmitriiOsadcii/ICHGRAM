import mongoose from "mongoose";

import { Request } from "express";
import { ValidateOptions } from "yup";
import { UserDocument } from "../db/models/User";
import { updateUserSchema } from "../validations/user.schema";
import {WithFollowFlag} from "../typescript/type";

export interface Validate<T> {
  validate: (value: T, options?: ValidateOptions) => Promise<T>;
}

export interface Iuser {
  email: string;
  fullName: string;
  username: string;
  password: string;
  token?: string;
  refreshToken?: string;
  biography?: string;
  profilePhoto?: string;
  website?: string;
  verificationCode?: string;
  verify: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IJWTTokenPayload {
  id: string;
}

export interface AunthReq extends Request {
  user: UserDocument
}

export interface ILoginResponse {
  token: string,
  refreshToken?: string,
  user: {
    fullName: string;
    username: string;
    email: string;
  }
}

export interface IResponse {
  token: string,
  refreshToke?: string,
  user: {
    _id?: string;
    fullName: string;
    username: string;
    email: string;
    biography?: string;
    profilePhoto?: string;
    webSite?: string;
  }
}

export interface IUserFound {
  email: string;
}

export interface IUpdateUser {
  payload: updateUserSchema;
  file: Express.Multer.File | undefined
} 
export interface ISearchUsersOptions {
  page: number;
  limit: number;
}

export interface ISearchResultResponse {
  users: WithFollowFlag[];
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface IListOptions {
  targetUserId: string; 
  currentUserId: mongoose.Types.ObjectId; 
  page: number;
  limit: number;
}

export interface IPaginatedUsers {
  users: WithFollowFlag[];
  page: number;
  limit: number;
  hasMore: boolean;
}