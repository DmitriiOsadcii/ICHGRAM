import { nanoid } from "nanoid";


const selectModal = [
  {
    id: nanoid(),
    text: "Delete",
    action: "modal",
    modalType: "deletePost",
  },
  {
    id: nanoid(),
    text: "Edit",
    action: "modal",
    modalType: "editPost",
  },
  {
    id: nanoid(),
    text: "Go to post",
    action: "goBack",
  },
  {
    id: nanoid(),
    text: "Copy link",
    action: "copyLink",
  },
  {
    id: nanoid(),
    text: "Cancel",
    action: "goBack",
  },
];

export default selectModal;