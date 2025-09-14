import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { followUser, unfollowUser } from "./follow.thunks";

type FollowItem = {
  isFollowing: boolean;
  followersCount: number;
  loading: boolean;
  error: string | null;
};

type FollowState = {
  byUserId: Record<string, FollowItem>;
};

const initialState: FollowState = { byUserId: {} };

const ensureItem = (store: FollowState, id: string, seed?: Partial<FollowItem>) => {
  if (!store.byUserId[id]) {
    store.byUserId[id] = {
      isFollowing: false,
      followersCount: 0,
      loading: false,
      error: null,
      ...seed,
    };
  } else if (seed) {
    store.byUserId[id] = { ...store.byUserId[id], ...seed };
  }
};

const followSlice = createSlice({
  name: "follows",
  initialState,
  reducers: {
    initialUserState: (
      store,
      { payload }: PayloadAction<{ id: string; isFollowed?: boolean; followersCount: number }>
    ) => {
      const { id, isFollowed, followersCount } = payload;
      ensureItem(store, id, {
        isFollowing: !!isFollowed,
        followersCount: Math.max(0, followersCount),
        loading: false,
        error: null,
      });
    },
    resetFollows: () => ({ byUserId: {} }),
  },
  extraReducers: (builder) => {
    builder
      // FOLLOW (оптимистично + откат)
      .addCase(followUser.pending, (store, { meta }) => {
        const id = meta.arg.id;
        ensureItem(store, id);
        const item = store.byUserId[id];
        item.loading = true;
        item.error = null;
        // оптимистично
        if (!item.isFollowing) {
          item.isFollowing = true;
          item.followersCount = Math.max(0, item.followersCount + 1);
        }
      })
      .addCase(followUser.fulfilled, (store, { payload, meta }) => {
        const id = meta.arg.id;
        ensureItem(store, id);
        const item = store.byUserId[id];
        item.loading = false;
        item.error = null;
        // приводим к серверному источнику истины
        if (typeof payload?.following === "boolean") item.isFollowing = payload.following;
        if (typeof payload?.followersCount === "number") {
          item.followersCount = Math.max(0, payload.followersCount);
        }
      })
      .addCase(followUser.rejected, (store, action) => {
        const id = action.meta.arg.id;
        ensureItem(store, id);
        const item = store.byUserId[id];
        // откат оптимистичного апдейта
        item.isFollowing = false;
        item.followersCount = Math.max(0, item.followersCount - 1);
        item.loading = false;
        item.error =
          (action.payload as string) || action.error?.message || "Cant follow";
      })

      // UNFOLLOW (оптимистично + откат)
      .addCase(unfollowUser.pending, (store, { meta }) => {
        const id = meta.arg.id;
        ensureItem(store, id);
        const item = store.byUserId[id];
        item.loading = true;
        item.error = null;
        // оптимистично
        if (item.isFollowing) {
          item.isFollowing = false;
          item.followersCount = Math.max(0, item.followersCount - 1);
        }
      })
      .addCase(unfollowUser.fulfilled, (store, { payload, meta }) => {
        const id = meta.arg.id;
        ensureItem(store, id);
        const item = store.byUserId[id];
        item.loading = false;
        item.error = null;
        if (typeof payload?.following === "boolean") item.isFollowing = payload.following;
        if (typeof payload?.followersCount === "number") {
          item.followersCount = Math.max(0, payload.followersCount);
        }
      })
      .addCase(unfollowUser.rejected, (store, action) => {
        const id = action.meta.arg.id;
        ensureItem(store, id);
        const item = store.byUserId[id];
        // откат оптимистичного апдейта
        item.isFollowing = true;
        item.followersCount = Math.max(0, item.followersCount + 1);
        item.loading = false;
        item.error =
          (action.payload as string) || action.error?.message || "Can not unfollow";
      });
  },
});

export const { initialUserState, resetFollows } = followSlice.actions;
export default followSlice.reducer;