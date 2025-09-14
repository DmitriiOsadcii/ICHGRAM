import { useRef, useState, useEffect } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

import Picture from "../../../../shared/components/PictureComponent/Picture";
import { selectAuth } from "../../../../redux/auth/auth.selectors";
import { closeModal } from "../../../../redux/modal/modal.slice";

import defaultAvatar from "../../../../assets/icons/avatar-default.svg";
import smileyIcon from "../../../../assets/icons/smileComment.png"

import styles from "./CreateModalPostForm.module.css";

const CreatePostForm = ({ submitForm, isEdit, currentPost }) => {
  const [pickedFile, setPickedFile] = useState(null);
  const { user: authUser } = useSelector(selectAuth); // <— достаем user из среза
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      text: currentPost?.text || "",
    },
  });

  const [showPicker, setShowPicker] = useState(false);
  const textareaRef = useRef(null);

  const handleFilePick = (file) => setPickedFile(file);

  const handleCancel = () => {
    dispatch(closeModal());
  };

  const onSubmitForm = (values) => {
    const payload = {
      text: values.text,
      photo: pickedFile ?? null,
    };
    submitForm(payload);
  };

  const insertAtCursor = (emoji) => {
    const el = textareaRef.current;
    const current = getValues("text") || "";
    if (!el) {
      setValue("text", current + emoji, { shouldDirty: true, shouldValidate: true });
      return;
    }
    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;
    const next = current.slice(0, start) + emoji + current.slice(end);
    setValue("text", next, { shouldDirty: true, shouldValidate: true });
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  useEffect(() => {
    if (isEdit && currentPost) {
      setValue("text", currentPost.text);
    }
  }, [isEdit, currentPost, setValue]);

  const textValue = watch("text") || "";
  const charCount = textValue.length;

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.header_cancel}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <h3 className={styles.header_title}>
          {isEdit ? "Edit post" : "Create new post"}
        </h3>

        <button type="submit" className={styles.header_submit}>
          {isEdit ? "Done" : "Share"}
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.content_upload}>
          <Picture
            onHandle={handleFilePick}
            defaultAvatar={isEdit && currentPost?.photo ? currentPost.photo : undefined}
          />
        </div>

        <div className={styles.content_aside}>
          <div className={styles.aside_top}>
            {/* user header */}
            <div className={styles.user}>
              <div className={styles.user_avatarRing}>
                <img
                  src={authUser?.profilePhoto || defaultAvatar}
                  alt="User avatar"
                  className={styles.user_avatar}
                />
              </div>
              <p className={styles.user_name}>{authUser?.username}</p>
            </div>

            {/* editor */}
            <div className={styles.editor}>
              <textarea
                ref={textareaRef}
                {...register("text", {
                  maxLength: {
                    value: 2200,
                    message: "About must be less than 2200 characters",
                  },
                })}
                maxLength={2200}
                className={styles.editor_textarea}
              />
              <div className={styles.editor_counter}>{charCount}/2200</div>
              {errors.text && (
                <p className={styles.editor_error}>{errors.text?.message}</p>
              )}
            </div>

            {/* emoji */}
            <div className={styles.emojiWrap}>
              <button
                type="button"
                className={styles.editor_emojiBtn}
                onClick={() => setShowPicker((v) => !v)}
                aria-label="Insert emoji"
              >
                <img src={smileyIcon} alt="" />
              </button>
              {showPicker && (
                <div className={styles.emojiPicker}>
                  <Picker
                    data={data}
                    onEmojiSelect={(e) => insertAtCursor(e.native)}
                    previewPosition="none"
                    skinTonePosition="none"
                    navPosition="bottom"
                    theme="light"
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </form>
  );
};

export default CreatePostForm;