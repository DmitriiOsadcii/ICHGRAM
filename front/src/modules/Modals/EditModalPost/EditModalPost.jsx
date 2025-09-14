import { useState } from "react";
import { useNavigate } from "react-router-dom";

import CreatePostForm from "../CreateModalPost/CreateModalPostForm/CreateModalPostForm";
import Loader from "../../../shared/components/LoaderComponent/Loader";
import Error from "../../../shared/components/ErrorComponent/Error"

import { useDispatch } from "react-redux";
import { updatePostApi } from "../../../shared/api/post.api";
import { closeModal } from "../../../redux/modal/modal.slice";

import styles from "./EditModalPost.module.css";

const EditModalPost=({ post })=> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmitEdit = async (values) => {
    try {
      setIsSubmitting(true);
      setHasError(false);

      await updatePostApi(post._id, values);

      // если нет вложенных модалок, одного закрытия достаточно
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <CreatePostForm isEdit currentPost={post} submitForm={handleSubmitEdit} />
      {isSubmitting && <Loader loading={isSubmitting} />}
      {hasError && <Error>{errorMsg}</Error>}
    </div>
  );
}

export default EditModalPost;