import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

import { switchLike } from "./like.thunks"

import type { ILikeItem, ILikesState } from "../../typescript/interfaces"

const checkItem = (store: ILikesState, postId: string, seed?: Partial<ILikeItem>) => {
    if (!store.byPostId[postId]) {
        store.byPostId[postId] = {
            isLiked: false,
            likesCount: 0,
            loading: false,
            error: null,
            ...seed
        }
    }
}

const initialState: ILikesState = {
    byPostId: {}
}

const likeSlice = createSlice({
    name: "like",
    initialState,
    reducers: {
        shwoLikes: (
            store,
            { payload }: PayloadAction<Array<{ _id: string; likesCount: number; isLikedByCurrentUser?: boolean }>>
        ) => {
            payload.forEach(({ _id, likesCount, isLikedByCurrentUser }) => {
                checkItem(store, _id);
                store.byPostId[_id] = {
                    isLiked: !!isLikedByCurrentUser,
                    likesCount,
                    loading: false,
                    error: null,
                };
            });
        },
        toggleLikes: (
            store,
            { payload: { postId } }: PayloadAction<{ postId: string }>
        ) => {
            checkItem(store, postId);

            const likeData = store.byPostId[postId];
            if (likeData.loading) return; // защита от повторных кликов

            likeData.loading = true;
            likeData.error = null;

            // переключаем состояние лайка
            const wasLiked = likeData.isLiked;
            likeData.isLiked = !wasLiked;

            // корректируем количество лайков
            likeData.likesCount = Math.max(0, likeData.likesCount + (wasLiked ? -1 : 1));
        },
        resetLikes: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(switchLike.pending, (store, action) => {
                const { postId } = action.meta.arg;
                checkItem(store, postId)
            })
            .addCase(switchLike.fulfilled, (store, { payload }) => {
                const { liked, likesCount, postId } = payload
                checkItem(store, postId)
                const item = store.byPostId[postId]
                item.isLiked = liked;
                item.likesCount = likesCount
                item.loading = false
                item.error = null
            })
            .addCase(switchLike.rejected, (store, { payload, meta }) => {
                const postId = payload?.postId ?? meta.arg.postId
                checkItem(store, postId)
                const item = store.byPostId[postId]
                item.isLiked = !item.isLiked;
                item.likesCount += item.isLiked ? 1 : -1;
                if (item.likesCount < 0) item.likesCount = 0;
                item.loading = false
                item.error = payload?.message ?? "Cannot like"
            })
    }
})

export const { shwoLikes, toggleLikes, resetLikes } = likeSlice.actions;

export default likeSlice.reducer;