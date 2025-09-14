import { forwardRef, useCallback, useState } from "react";

import likeIcon from "../../../assets/icons/like.png";
import defAvatar from "../../../assets/icons/avatar-default.svg";
import HeartFilled from "../IconsComponent/FilledLikeIcon"; // компонент с заполненным сердцем
import getTimeAgo from "../../utils/getTimeAgo";

import styles from "./CommentContainerComponent.module.css";

const Comment = forwardRef(({ comment }, ref) => {
  const commentAgeLabel = getTimeAgo(comment.updatedAt ?? 0);

  // стартовые значения из комментария, если есть
  const [liked, setLiked] = useState(Boolean(comment?.isLikedByCurrentUser));
  const [likes, setLikes] = useState(Number(comment?.likesCount ?? 0));

  const handleToggleLike = useCallback(() => {
    setLiked(prev => {
      const next = !prev;
      setLikes(n => Math.max(0, n + (next ? 1 : -1)));
      
      return next;
    });
  }, []);

  return (
    <li className={styles.cmtItem} ref={ref}>
      <div className={styles.avatarBox}>
        <img
          className={styles.avatar}
          src={comment.userId.profilePhoto || defAvatar}
          alt="avatar"
        />
      </div>

      <div className={styles.cmtBody}>
        <div className={styles.cmtText}>
          <p>
            <span className={styles.cmtUsername}>{comment.userId.username}</span>
            <span>{comment.text}</span>
          </p>
        </div>

        <div className={styles.cmtMeta}>
          <p className={styles.cmtAge}>{commentAgeLabel}</p>
          <div className={styles.cmtLikes}>
            <p>Likes:</p>
            <p>{likes}</p>
          </div>
        </div>
      </div>

      <div className={styles.cmtActions}>
        <button
          type="button"
          className={`${styles.cmtLikeBtn} ${liked ? styles.liked : ""}`}
          aria-pressed={liked}
          aria-label={liked ? "Unlike" : "Like"}
          onClick={handleToggleLike}
        >
          {liked ? (
            <HeartFilled className={styles.cmtIcon} />
          ) : (
            <img src={likeIcon} alt="like" className={styles.cmtIcon} />
          )}
        </button>
      </div>
    </li>
  );
});

export default Comment;
