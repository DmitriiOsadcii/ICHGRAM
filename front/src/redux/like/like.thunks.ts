import { createAsyncThunk } from "@reduxjs/toolkit";

import { toggleLikeApi } from "../../shared/api/like.api";
import type { IToggleLike } from "../../typescript/interfaces";


export const switchLike = createAsyncThunk<{ postId: string } & IToggleLike, { postId: string }, { rejectValue: { postId: string, message: string } }>("/likes/switch", async ({ postId }, { rejectWithValue }) => {
    try {
        const data = await toggleLikeApi(postId)
        return { postId, ...data }
    } catch (error) {
        return rejectWithValue({ postId, message: error instanceof Error ? error.message : "Unknown error" });
    }
})