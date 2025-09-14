import type { IChoose } from "../../typescript/interfaces";

const chooseOptionData: IChoose[] = [
    {
        text: "Delete",
        action: "modal",
        modalType: "deletePost",
    },
    {
        text: "Edit",
        action: "modal",
        modalType: "editPost",
    },
    {
        text: "Go to post",
        action: "goBack",
    },
    {
        text: "Copy link",
        action: "copyLink",
    },
    {
        text: "Cancel",
        action: "goBack",
    },
]

export default chooseOptionData;