import { useSelector, useDispatch } from "react-redux";

import CreateModalPost from "../Modals/CreateModalPost/CreateModalPost";
import PostModal from "../Modals/PostModal/PostModal";
import EditSelectionModal from "../Modals/EditSelectionModal/EditSelectionModal";
import EditModalPost from "../Modals/EditModalPost/EditModalPost";
import DeleteModalPost from "../Modals/DeleteModalPost/DeleteModalPost";

import { closeModal} from "../../redux/modal/modal.slice"
import {selectModal} from "../../redux/modal/modal.selector";

import styles from "./Modal.module.css";

const Modal =() =>{
  const modals = useSelector(selectModal);
  const dispatch = useDispatch();

  return (
    <>
      {modals.map((modal, idx) => (
        <div
          key={idx}
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget && idx === modals.length - 1) {
              dispatch(closeModal());
            }
          }}
        >
          <div className={styles.modalPanel}>
            {modal.modalType === "createPost" && <CreateModalPost />}

            {modal.modalType === "viewPost" && modal.postData && (
              <PostModal post={modal.postData} />
            )}

            {modal.modalType === "editSelection" && modal.postData && (
              <EditSelectionModal post={modal.postData} />
            )}

            {modal.modalType === "editPost" && modal.postData && (
              <EditModalPost post={modal.postData} />
            )}

            {modal.modalType === "deletePost" && modal.postData && (
              <DeleteModalPost post={modal.postData} />
            )}
          </div>
        </div>
      ))}
    </>
  );
}

export default Modal;