import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { IPost, IModalState } from "../../typescript/interfaces";
import type { ModalType } from "../../typescript/types";

const initialState: IModalState = {
    modalStack: []
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        showModal(store, { payload }: PayloadAction<ModalType>) {
            store.modalStack.push({ modalType: payload })
        },
        showPostModal(store, { payload }: PayloadAction<IPost>) {
            store.modalStack.push({ modalType: "viewPost", postData: payload })
        },
        showEditModal(store, { payload }: PayloadAction<{ type: ModalType; postData: IPost }>) {
            store.modalStack.push({
                modalType: payload.type,
                postData: payload.postData
            })
        },
        showPostEditModal(store, { payload }: PayloadAction<IPost>) {
            store.modalStack.push({ modalType: "editPost", postData: payload });
        },
        deletePostModal(store, { payload }: PayloadAction<IPost>) {
            store.modalStack.push({ modalType: "deletePost", postData: payload })
        },
        closeModal(store) {
            store.modalStack.pop();
        }

    }
})
export const { closeModal, showEditModal, deletePostModal, showModal, showPostEditModal, showPostModal } = modalSlice.actions

export default modalSlice.reducer;