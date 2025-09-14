import selectModal from "../../../shared/data/selectModal";

import { useDispatch } from "react-redux";
import {
  showPostEditModal,
  deletePostModal,
  closeModal
} from "../../../redux/modal/modal.slice";

import styles from "./EditSelectionModal.module.css";

function EditSelectionModal({ post }) {
  const dispatch = useDispatch();

  const handleClick = async (item) => {
    switch (item.action) {
      case "modal":
        dispatch(closeModal());
        if (item.modalType === "editPost") dispatch(showPostEditModal(post));
        if (item.modalType === "deletePost") dispatch(deletePostModal(post));
        break;

      case "goBack":
        dispatch(closeModal());
        break;

      case "copyLink":
        try {
          const postId = post._id;
          const link = `${window.location.origin}/posts/${postId}`;
          await navigator.clipboard.writeText(link);
          alert("Link copied to clipboard!");
          dispatch(closeModal());
        } catch (err) {
          alert(`Failed to copy link, ${err}`);
        }
        break;

      default:
        break;
    }
  };

  const items = selectModal.map((item, index) => (
    <li
      key={item.id}
      className={`${styles.modalAction} ${
        item.text === "Delete" ? styles.modalDanger : ""
      } ${index === 0 ? styles.modalFirst : ""} ${
        index === selectModal.length - 1 ? styles.modalLast : ""
      }`}
      onClick={() => handleClick(item)}
    >
      {item.text}
    </li>
  ));

  return (
    <div className={styles.modalContainer}>
      <ul className={styles.modalActions}>{items}</ul>
    </div>
  );
}

export default EditSelectionModal;