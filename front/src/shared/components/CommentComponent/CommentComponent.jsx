import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import styles from "./CommentComponent.module.css";
import smile from "../../../assets/icons/smileComment.png";

const Comment = ({ submitForm, loading }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { text: "" } });

  const [openPicker, setOpenPicker] = useState(false);
  const inputRef = useRef(null);
  const pickerWrapRef = useRef(null);

  // Разделяем ref от register, чтобы совместить с нашим inputRef
  const { ref: rhfRef, ...textReg } = register("text", {
    required: "Text is required",
    validate: (v) => v.trim().length > 0 || "Comment can’t be empty",
    maxLength: { value: 500, message: "Max 500 chars" },
  });

  const onSubmit = (values) => {
    submitForm({ text: values.text.trim() });
    reset();
    setOpenPicker(false);
  };

  // Вставка строки (эмодзи) в позицию курсора
  const insertAtCaret = (str) => {
    const el = inputRef.current;
    const current = getValues("text") || "";

    if (!el) {
      // если по какой-то причине ref ещё не привязался — вставим в конец
      setValue("text", current + str, { shouldDirty: true, shouldValidate: true });
      return;
    }

    const start = el.selectionStart ?? current.length;
    const end = el.selectionEnd ?? current.length;

    const next = current.slice(0, start) + str + current.slice(end);

    setValue("text", next, { shouldDirty: true, shouldValidate: true });

    // вернуть курсор сразу после вставленного эмодзи
    requestAnimationFrame(() => {
      const pos = start + str.length;
      try {
        el.setSelectionRange(pos, pos);
        el.focus();
      } catch {}
    });
  };

  const handleEmojiSelect = (emoji) => {
    // emoji.native — сам символ, например "😄"
    const toInsert = emoji?.native || "";
    if (!toInsert) return;
    insertAtCaret(toInsert);
  };

  // Клик вне пикера — закрыть
  useEffect(() => {
    if (!openPicker) return;
    const onDown = (e) => {
      if (!pickerWrapRef.current) return;
      if (
        !pickerWrapRef.current.contains(e.target) &&
        !inputRef.current?.contains?.(e.target)
      ) {
        setOpenPicker(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openPicker]);

  return (
    <div className={styles.container}>
      <form className={styles["comment-form"]} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles["comment-form_input-wrap"]}>
          {/* Кнопка-иконка для открытия пикера */}
          <button
            type="button"
            className={styles["emoji-button"]}
            onClick={() => setOpenPicker((v) => !v)}
            aria-label="Insert emoji"
          >
            <img src={smile} alt="smileIcon" />
          </button>

          <input
            placeholder="Add comment"
            className={styles["comment-form_input"]}
            {...textReg}
            ref={(el) => {
              rhfRef(el);
              inputRef.current = el;
            }}
          />

          {/* Валидация */}
          {errors.text && <p className={styles.error}>{errors.text.message}</p>}

          <div>
            <button
              type="submit"
              className={styles["comment-form_submit"]}
              disabled={loading || isSubmitting}
            >
              Send
            </button>
          </div>

          {/* Пикер */}
          {openPicker && (
            <div ref={pickerWrapRef} className={styles["emoji-picker"]}>
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                previewPosition="none"
                skinTonePosition="none"
                navPosition="none"
                searchPosition="none"
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Comment;