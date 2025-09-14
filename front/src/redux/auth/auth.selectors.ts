import type { RootState } from "../store";

export const selectToken = (store: RootState) => store.auth.token;
export const selectAuth = (store: RootState) => store.auth;
export const selectAuthUser = (store: RootState) => store.auth.user;
export const selectUpdateStatus = (store: RootState) => store.auth.updateStatus;