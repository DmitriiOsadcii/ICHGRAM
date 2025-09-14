import { useState, useEffect } from "react";
import Error from "../ErrorComponent/Error";
import uploader from "../../../assets/icons/uploader.png";
import styles from "./Picture.module.css";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10MB 

const Picture = ({ onHandle, preview, defaultAvatar, previewClassName = "" }) => {
  const [pic, setPic] = useState(null);
  const [error, setError] = useState("");

  // чистим URL-объект при смене/размонтировании
  useEffect(() => {
    return () => {
      if (pic) URL.revokeObjectURL(pic);
    };
  }, [pic]);

  const checkFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1) MIME префикс
    if (!file.type.startsWith("image/")) {
      setError("Only images are allowed.");
      return;
    }
    // 2) Разрешённые типы
    if (!ALLOWED.has(file.type)) {
      setError("Allowed types: JPG, PNG, WEBP, GIF.");
      return;
    }
    // 3) Размер
    if (file.size > MAX_BYTES) {
      setError(`Max size is ${Math.round(MAX_BYTES / 1024 / 1024)}MB.`);
      return;
    }

    setError("");
    const url = URL.createObjectURL(file);
    setPic((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    onHandle && onHandle(file);
  };

  return (
    <>
    {/* инпут скрываем только когда уже выбрали новый файл */}
    {!pic && (
      <>
        <label className={styles.uploaderClickArea} htmlFor="picture">
          <img className={styles.uploaderGlyph} src={uploader} alt="uploader" />
        </label>
        <input
          className={styles.inputStealth}
          type="file"
          id="picture"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={checkFile}
        />
      </>
    )}

    {(pic || preview || defaultAvatar) && (
      <img
        src={preview || pic || defaultAvatar}
        alt="preview"
        className={`${styles.imgPreview} ${previewClassName}`}
      />
    )}

    {error && <Error>{error}</Error>}
  </>
  );
};

export default Picture;