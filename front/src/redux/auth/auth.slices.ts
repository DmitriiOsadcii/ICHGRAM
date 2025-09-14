import { createSlice } from "@reduxjs/toolkit";

import { forgotPassword, login, logout, registration, resendEmail, updateProfile, verify , getCurrent} from "./auth.thunks"

import type { IAuthState } from "../../typescript/interfaces";
import { pending, rejected } from "../../shared/lib/redux";
import tokenStorage from "../../shared/utils/tokenStorage";


const initialState: IAuthState = {
    token: "",
    user: null,
    loading: false,
    error: null,
    updateStatus: "idle",
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registration.pending, pending)
            .addCase(registration.fulfilled, (store) => {
                store.loading = false;
            })
            .addCase(registration.rejected, rejected)

            .addCase(login.pending, pending)
            .addCase(login.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.token = payload.token;
                store.user = payload.user;
                tokenStorage.set(payload.token)
            })
            .addCase(login.rejected, rejected)

            .addCase(verify.pending, pending)
            .addCase(verify.fulfilled, (store) => {
                store.loading = false
            })
            .addCase(verify.rejected, rejected)

            .addCase(forgotPassword.pending, pending)
            .addCase(forgotPassword.fulfilled, (store) => {
                store.loading = false
            })
            .addCase(forgotPassword.rejected, rejected)

            .addCase(resendEmail.pending, pending)
            .addCase(resendEmail.fulfilled, (store) => {
                store.loading = false
            })
            .addCase(resendEmail.rejected, rejected)

            .addCase(logout.pending, pending)
            .addCase(logout.fulfilled, () => {
                tokenStorage.clear();                  // ← чистим при выходе
                return initialState;
            })

            .addCase(logout.rejected, rejected)

            .addCase(updateProfile.pending, (store) => {
                store.loading = true;
                store.error = null;
                store.updateStatus = "pending"
            })
            .addCase(updateProfile.fulfilled, (store, { payload }) => {
                store.loading = false;
                store.user = payload;
                store.updateStatus = "success";
            })
            .addCase(updateProfile.rejected, (store, { payload }) => {
                store.loading = false;
                if (typeof payload === "string" || payload === undefined) {
                    store.error = payload ?? null;
                } else {
                    store.error = "Unknown Error !"
                }
                store.updateStatus = "error"
            })
            .addCase(getCurrent.pending, pending)
            .addCase(getCurrent.fulfilled, (store, { payload }) => {
            store.loading = false;
            store.token = payload.token;
            store.user = payload.user;
            store.updateStatus = "idle";
             })
            .addCase(getCurrent.rejected, () => initialState)

    }
})

export default authSlice.reducer;