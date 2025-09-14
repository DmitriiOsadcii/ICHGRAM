import { UserDocument, PublicUserResponse } from "../db/models/User";
export type ValidationType = {
    value: RegExp;
    message: string;
}

export type StatusCode = 400 | 401 | 403 | 404 | 409 | 500;

export type FileNameCallBack = (error: Error | null, filename: string) => void

export type SendEmailOptions = {
    to: string[] | string;
    subject: string;
    html: string;
    text?: string;
}

export type WithFollowFlag = PublicUserResponse & {
  isFollowedByCurrentUser: boolean;
};