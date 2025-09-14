import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import avatar from "../../../assets/icons/avatar-default.svg";

import Post  from "../../../shared/components/PostsComponent/Post";
import FollowButton from "../../../shared/components/ButtonComponent/Follow/FollowButton";

import getTimeAgo from "../../../shared/utils/getTimeAgo";
import { useDispatch } from "react-redux";

import { toggleLikes} from "../../../redux/like/like.slice";
import { switchLike } from "../../../redux/like/like.thunks";
import { selectLike } from "../../../redux/like/like.selectors";
import { showPostModal } from "../../../redux/modal/modal.slice";

import styles from "./Element.module.css";

function PostElement({ post }) {
  const likeState = useSelector(selectLike(post._id));
  const dispatch = useDispatch();

  const handleLikeToggle = () => {
    dispatch(toggleLikes({ postId: post._id }));
    dispatch(switchLike({ postId: post._id }));
  };

  const handleOpenPost = () => {
    dispatch(showPostModal(post));
  };

  const postDateLabel = getTimeAgo(post.updatedAt ?? 0);
  const hasComments = post.commentsCount > 0;

   return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.avatarBox}>
          <img className={styles.avatar} src={post.userId.profilePhoto || avatar} alt="avatar" />
        </div>

        <div className={styles.postHeaderInfo}>
          {/* Чтобы клик по имени НЕ открывал пост — остановим всплытие ниже (во Варианте B). Здесь не нужно */}
          <Link to={`/users/${post.userId._id}`} className={styles.postLink}>
            <p className={styles.postUsername}>{post.userId.username}</p>
          </Link>
          <span className={styles.postMeta}> • </span>
          <p className={styles.postMeta}>{postDateLabel}</p>
          <span className={styles.postMeta}> • </span>

          <FollowButton
            userId={post.userId._id}
            initiallyFollowed={post.userId.isFollowedByCurrentUser /* или fallback: post.isAuthorFollowedByCurrentUser */}
            initialFollowersCount={post.userId.followersCount}
            variantWhenFollowing="secondary"
            variantWhenNotFollowing="primary"
          />
        </div>
      </div>

      {/* Картинка как кнопка */}
      <button
        type="button"
        className={styles.postImageBtn}
        onClick={handleOpenPost}
        aria-label="Open post"
      >
        <img src={post.photo} alt="post" className={styles.postImage} />
      </button>

      <div className={styles.postContent}>
        <div className={styles.postInfo}>
          <Post
            likesAmount={likeState?.likesCount ?? post.likesCount}
            liked={likeState?.isLiked ?? !!post.isLikedByCurrentUser}
            onToggle={handleLikeToggle}
          />
        </div>

        <div className={styles.postBody}>
          <div className={styles.postText}>
            <p>
              <span className={styles.postUsernameInline}>{post.userId.username}</span>
              <span>{post.text}</span>
            </p>
          </div>
        </div>

        {/* Комменты тоже открывают модалку */}
        <button
          type="button"
          className={styles.postComments}
          onClick={handleOpenPost}
          aria-label="Open post comments"
        >
          {hasComments ? (
            <span>View all comments ({post.commentsCount})</span>
          ) : (
            <span>Add comment</span>
          )}
        </button>
      </div>
    </div>
  );
}

export default PostElement;