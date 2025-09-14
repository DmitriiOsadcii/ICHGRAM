// modules/Explorer/Explorer.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../../shared/components/LoaderComponent/Loader";
import Error from "../../shared/components/ErrorComponent/Error";

import { shwoLikes } from "../../redux/like/like.slice";
import { showPostModal } from "../../redux/modal/modal.slice";
import { getExploreApi } from "../../shared/api/post.api";
import { selectToken } from "../../redux/auth/auth.selectors";

import styles from "./Explorer.module.css";

const Explorer = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // если в axios нет глобального интерсептора — пробросим токен в запрос
        const data = await getExploreApi(token);

        if (data !== undefined) {
          setPosts(data);
          dispatch(shwoLikes(data));
        }
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Unknown error";
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, [dispatch, token]);

  const patternClass = (i) => {
    const m = i % 10;
    return m === 2 || m === 5 ? styles.tall : "";
  };

  const handleClick = (post) => {
    dispatch(showPostModal(post));
  };

  // ВАЖНО: тут должен быть return (или круглые скобки)
  const elements = posts.map((post, index) => (
    <button
      key={post._id}
      type="button"
      className={`${styles.item} ${patternClass(index)}`}
      onClick={() => handleClick(post)}
      aria-label="Open post"
    >
      <img src={post.photo} alt="" className={styles.itemImg} />
    </button>
  ));

  return (
    <div className={styles.feedShell}>
      <div className={styles.mosaicGrid}>{elements}</div>

      {!loading && !error && posts.length === 0 && (
        <p className={styles.empty}>No posts to explore yet</p>
      )}

      {loading && <Loader loading={loading} />}
      {error && <Error>{error}</Error>}
    </div>
  );
};

export default Explorer;