import type { RootState } from "../store";

export const selectFollowByUserId = (id: string) => (store: RootState) => store.follows.byUserId[id]