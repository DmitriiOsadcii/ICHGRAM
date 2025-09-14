import styles from "./Post.module.css"
import like from "../../../assets/icons/like.png"
import comment from "../../../assets/icons/comment.png"
import HeartFilled from "../IconsComponent/FilledLikeIcon"


const Post = ({ likesAmount, liked, onToggle }) => {

    return (
       <div className={styles.postInfoBox}>
      <div className={styles.iconsBox}>
        <button
          type="button"
          className={styles.likeBtn}
          onClick={onToggle}
        >
          {liked ? (
            <HeartFilled />
          ) : (
            <img src={like} alt="like" />
          )}
        </button>
        <img src={comment} alt="comment" />
      </div>
      <div className={styles.infoBox}>
        <div className={styles.infoLikesBox}>
          <p>{likesAmount}</p>
          <p>likes</p>
        </div>
      </div>
    </div>
    )
}

export default Post;