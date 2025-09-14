import type { RootState } from "../store";

export const selectLike = (postId:string)=> (store:RootState)=> store.like.byPostId[postId]