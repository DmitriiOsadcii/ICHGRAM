import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux"

import CreateModalPostForm from "../CreateModalPost/CreateModalPostForm/CreateModalPostForm";
import Loader from "../../../shared/components/LoaderComponent/Loader"
import Error from "../../../shared/components/ErrorComponent/Error"

import { addPostApi } from "../../../shared/api/post.api";
import { closeModal } from "../../../redux/modal/modal.slice";

import styles from "./CreateModalPost.module.css";

const  CreateModalPost =()=> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmitPost = async (values) => {
    try {
      setIsSubmitting(true);
      setHasError(false);

      await addPostApi(values);

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
    <div className={styles.postModal}>
      <CreateModalPostForm submitForm={handleSubmitPost} />
      {isSubmitting && <Loader loading={isSubmitting} />}
      {hasError && <Error>{errorMsg}</Error>}
    </div>
  );
}

export default CreateModalPost;