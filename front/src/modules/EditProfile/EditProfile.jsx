import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import ButtonComponent from "../../shared/components/ButtonComponent/Button";
import EditProfileForm from "./EditProfileForm/EditProfileForm";
import PictureComponent from "../../shared/components/PictureComponent/Picture";
import LoaderComponent from "../../shared/components/LoaderComponent/Loader";
import ErrorComponent from "../../shared/components/ErrorComponent/Error";

import avatar from "../../assets/icons/avatar-default.svg";

import { updateProfile } from "../../redux/auth/auth.thunks";
import {
  selectAuth,
  selectAuthUser,
  selectUpdateStatus,
} from "../../redux/auth/auth.selectors";

import styles from "./EditProfile.module.css";

const SUCCESS_HIDE_MS = 2500; // через сколько прятать сообщение

const ProfileEditorPanel = () => {
  const authUser = useSelector(selectAuthUser);
  const dispatch = useDispatch();

  const updateState = useSelector(selectUpdateStatus);
  const { loading: isLoading, error: globalError } = useSelector(selectAuth);

  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [successText, setSuccessText] = useState("");
  const [localError, setLocalError] = useState("");
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // показать сообщение при успехе
  useEffect(() => {
    if (updateState === "success") {
      setIsSuccessVisible(true);
      setSuccessText("Updated Successfully");
    }
  }, [updateState]);

  // спрятать сообщение через SUCCESS_HIDE_MS
  useEffect(() => {
    if (!isSuccessVisible) return;
    const t = setTimeout(() => {
      setIsSuccessVisible(false);
    }, SUCCESS_HIDE_MS);
    return () => clearTimeout(t);
  }, [isSuccessVisible]);

  const submitProfile = async (values) => {
    setLocalError("");
    const data = {
      username: values.username,
      fullName: values.fullName,
      website: values.website?.trim() ?? "",
      biography: values.biography?.trim() ?? "",
    };

    try {
      
      dispatch(updateProfile(data));
    } catch (err) {
      if (typeof err === "string") setLocalError(err);
    }
  };

  const onFilePicked = (file) => {
  setFileToUpload(file);
};

  const applyNewPhoto = async () => {
  if (!fileToUpload) return;
  setIsUploading(true);
  setLocalError("");
  try {
    await dispatch(updateProfile({ profilePhoto: fileToUpload })).unwrap();
    setIsUploaderOpen(false);
    setFileToUpload(null);
  } catch (e) {
    setLocalError(e?.message || "Failed to update photo");
  } finally {
    setIsUploading(false);
  }
};

  return (
    <>
      <div className={styles.profile}>
        <h2 className={styles.profile_title}>Edit profile</h2>

        <div className={styles.profile_header}>
          <div className={styles.profile_user}>
            <div className={styles.profile_avatarBox}>
              <img
                src={authUser?.profilePhoto || avatar}
                alt="User avatar"
                className={styles.profile_avatar}
              />
            </div>

            <div className={styles.profile_meta}>
              <p className={styles.profile_username}>{authUser?.username}</p>
              <p className={styles.profile_fullName}>{authUser?.fullName}</p>
            </div>
          </div>

          <div className={styles.btnBox}>
            <ButtonComponent
              children={isUploaderOpen ? "Cancel" : "New photo"}
              onClick={() => setIsUploaderOpen((prev) => !prev)}
            />
          </div>
        </div>

        {isUploaderOpen && (
          <div className={styles.profile_upload}>
            <PictureComponent
              onHandle={onFilePicked}
              defaultAvatar={authUser?.profilePhoto || avatar}
              previewClassName={styles.previewEditProfile}
            />

            <div className={styles.uploadBtnBox}>
              <ButtonComponent 
                children={isUploading ? "Saving..." : "Save Photo"}
                onClick={applyNewPhoto}
                disabled={!fileToUpload || isUploading} />
            </div>
          </div>
        )}

        <EditProfileForm
          textButton="Save"
          submitForm={submitProfile}
          fields={["username", "fullName", "website", "biography"]}
          user={authUser}
          error={localError}
        />

        {isSuccessVisible && (
          <div className={styles.successMessageBox}>
            <p className={styles.successMessage}>{successText}</p>
          </div>
        )}

        {isLoading && <LoaderComponent loading={isLoading} />}
        {globalError && <ErrorComponent>{globalError}</ErrorComponent>}
      </div>
    </>
  );
};

export default ProfileEditorPanel;