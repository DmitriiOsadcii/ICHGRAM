import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth/auth.slices"
import followReducer from "./follow/follow.slice"
import modalReducer from "./modal/modal.slice"
import likeReducer from "./like/like.slice"

const rootReducer = combineReducers({
    auth: authReducer,
    follows: followReducer,
    modal: modalReducer,
    like: likeReducer
})
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export default persistedReducer;