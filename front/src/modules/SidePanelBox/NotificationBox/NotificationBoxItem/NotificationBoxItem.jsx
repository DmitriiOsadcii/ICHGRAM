import { forwardRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import defaultAvatar from "../../../../assets/icons/avatar-default.svg";
import getTimeAgo from "../../../../shared/utils/getTimeAgo";

import styles from "./NotificationBoxItem.module.css";

const NotificationBoxItem = forwardRef(({ note }, ref) => {
  const navigate = useNavigate();
  const location = useLocation();

  const timeAgoLabel = getTimeAgo(note.createdAt ?? 0);

  let actionText = "";
  switch (note.type) {
    case "follow":
      actionText = "started following.";
      break;
    case "like":
      actionText = "liked your photo.";
      break;
    case "comment":
      actionText = "commented on your photo.";
      break;
    default:
      actionText = "";
  }

  const openPost = () => {
    if (!note.postId?._id) return;
    navigate(`/posts/${note.postId._id}`, {
      state: { backgroundLocation: location },
    });
  };

  return (
    <li className={styles.ntfItem} ref={ref}>
      <div className={styles.ntfMain}>
        <div className={styles.ntfAvatarBox}>
          <img
            src={note.senderId.profilePhoto || defaultAvatar}
            alt="User avatar"
            className={styles.ntfAvatar}
          />
        </div>

        <div className={styles.ntfContent}>
          <p>
            <Link to={`/users/${note.senderId._id}`} className={styles.ntfUser}>
              {note.senderId.username}
            </Link>
            <span> {actionText}</span>
          </p>
          <p className={styles.ntfTime}>{timeAgoLabel}</p>
        </div>
      </div>

      {note.postId?.photo && (
        <div className={styles.ntfPostThumb} onClick={openPost}>
          <img
            src={note.postId?.photo}
            alt="Post thumbnail"
            className={styles.ntfPostImg}
          />
        </div>
      )}
    </li>
  );
});

export default NotificationBoxItem;