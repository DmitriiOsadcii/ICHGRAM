import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Loader from "../../../shared/components/LoaderComponent/Loader"
import Error from "../../../shared/components/ErrorComponent/Error";

import {useDispatch} from "react-redux"
import { closeModal } from "../../../redux/modal/modal.slice";
import { deletePostApi } from "../../../shared/api/post.api";

import styles from "./DeleteModalPost.module.css";

const DeleteModalPost= ({ post })=> {
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (postId) => {
    try {
      setIsDeleting(true);
      setHasError(false);

      await deletePostApi(postId);

      dispatch(closeModal());
      navigate("/api/profile", { state: { refreshPosts: Date.now() } });
    } catch (err) {
      setHasError(true);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unknown error";
      setErrorMsg(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <h3 className={styles.modalTitle}>Delete Post?</h3>
        <p className={styles.modalDescription}>
          Are you sure you want to delete this post?
        </p>
      </div>

      <ul className={styles.modalActions}>
        <li
          className={`${styles.modalAction} ${styles.modalDanger}`}
          onClick={() => handleDelete(post._id)}
        >
          Delete
        </li>
        <li
          className={`${styles.modalAction} ${styles.modalLast}`}
          onClick={handleCancel}
        >
          Cancel
        </li>
      </ul>

      {isDeleting && <Loader loading={isDeleting} />}
      {hasError && <Error>{errorMsg}</Error>}
    </div>
  );
}

export default DeleteModalPost;