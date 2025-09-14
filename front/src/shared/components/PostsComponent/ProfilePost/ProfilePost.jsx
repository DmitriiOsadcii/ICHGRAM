import { useDispatch } from "react-redux";

import { showPostModal } from "../../../../redux/modal/modal.slice";
import styles from "./ProfilePost.module.css";

const ProfilePost = ({ posts = [] }) => {
  const dispatch = useDispatch();

  const handleClick = (post) => {
    
    dispatch(showPostModal(post));
    
  };

  return (
    <section className={styles.container}>
      <div className={styles.grid}>
        {posts.map((item) => (
          <div
            key={item._id}
            type="button"
            className={styles.postBtn}
            onClick={() => handleClick(item)}  
          >
            <img className={styles.cardImage} src={item.photo} alt="photo" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProfilePost;