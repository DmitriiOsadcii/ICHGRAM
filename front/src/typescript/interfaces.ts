import type { NotificationType } from "./types";
import type { ModalType } from "./types";

export interface IUser {
  _id: string;
  email: string;
  fullName: string;
  username: string;
  biography?: string;
  profilePhoto?: string;
  website?: string;
  createdAt?: Date;
  updatedAt?: Date;
  verified?: boolean;
  followersCount: number;
  followingCount: number;
  isFollowedByCurrentUser?: boolean
}

export interface IAuthState {
  token: string;
  user: null | IUser;
  loading: boolean;
  error: string | null;
  updateStatus: "idle" | "pending" | "success" | "error";
}

export interface IAuthResponse {
  token: string;
  refreshToken?: string;
  user: IUser;
}

export interface IRegisterPayload {
  email: string;
  fullName: string;
  username: string;
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IResendVerificationEmaiPayload {
  email: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IUpdateMyProfilePayload {
  id: string
  username?: string;
  fullName?: string;
  biography?: string;
  website?: string;
  profilePhoto?: File;
}

export interface IFollowStatusResponse {
  following: boolean;
  followersCount: number;
  iFollowCount: number;
}

export interface IUserFromPost {
  _id: string;
  fullName: string;
  username: string;
  profilePhoto?: string;
}

export interface IComment {
  _id: string;
  userId: IUserFromPost;
  postId: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IPost {
  _id: string;
  userId: IUserFromPost;
  text: string;
  photo: string;
  likesCount: number;
  commentsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  isLikedByCurrentUser: boolean;
}
export interface IToggleLike {
  liked: boolean;
  likesCount: number;
}

export interface IPostFromNote {
  _id: string;
  text: string;
  photo: string;
}

export interface ICommentFromNote {
  _id: string;
  text: string;
}

export interface INotification {
  _id: string;
  recipientId: string;
  senderId: IUserFromPost;
  type: NotificationType;
  postId?: IPostFromNote;
  commentId?: ICommentFromNote;
  isRead: boolean;
  createdAt: Date;
}

export interface IAddCommentPayload {
  text: string;
}

export interface IUpdateCommentPayload {
  text: string;
}

export interface ICommentResponse {
  comments: IComment[];
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface IGetNotific {
  notifications: INotification[];
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface IAddPostPayload {
  text: string;
  photo: File | null;
}

export interface IUpdatePostPayload {
  text: string;
  photo: File | null;
}

export interface IGetUserByIdPayload {
  id: string;
}

export interface ISearchResultPayload {
  users: IUser[];
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface IFollowUserPayload { id: string }

export interface IFollowItem {
  isFollowing: boolean;
  followersCount: number;
  loading: boolean;
  error: string | null;
}

export interface IFollowState {
  byUserId: {
    [userId: string]: IFollowItem;
  };
}

export interface IModalStackItem {
  modalType: ModalType;
  postData?: IPost | null;
}

export interface IModalState {
  modalStack: IModalStackItem[];
}

export interface ILikeItem {
  isLiked: boolean;
  likesCount: number;
  loading: boolean;
  error: string | null;
}

export interface ILikesState {
  byPostId: {
    [postId: string]: ILikeItem;
  };
}

export interface IChoose {
  text: string;
  action: "modal" | "goBack" | "copyLink";
  modalType?: ModalType;
}