import { createAsyncThunk } from "@reduxjs/toolkit";

import { followApi, unfollowApi } from "../../shared/api/follow.api";
import type { IFollowStatusResponse, IFollowUserPayload } from "../../typescript/interfaces";

export const followUser = createAsyncThunk<IFollowStatusResponse, IFollowUserPayload, { rejectValue: string }>("/follows/followUser", async ({ id }, { rejectWithValue }) => {
    try {
        const data = await followApi(id)
        return data
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Unknown error");
    }
})

export const unfollowUser = createAsyncThunk<IFollowStatusResponse, IFollowUserPayload, { rejectValue: string }>("/follows/unfollowUser", async ({ id }, { rejectWithValue }) => {
    try {
        const data = await unfollowApi(id)
        return data
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Unknown error")
    }
})

