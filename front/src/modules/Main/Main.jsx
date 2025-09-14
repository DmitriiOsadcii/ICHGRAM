import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Element from "./Element/Element";
import Loader from "../../shared/components/LoaderComponent/Loader";
import Error from "../../shared/components/ErrorComponent/Error";

import { getPostsApi } from "../../shared/api/post.api";
import { shwoLikes } from "../../redux/like/like.slice";
import { initialUserState } from "../../redux/follow/follow.slice";
import { selectToken } from "../../redux/auth/auth.selectors";

// ⬇️ добавь импорт экшена модалки
import { showPostModal } from "../../redux/modal/modal.slice";

import styles from "./Main.module.css";

function Main() {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        const data = await getPostsApi();
        if (data !== undefined) {
          setFeed(data);

          // лайки
          dispatch(shwoLikes(data));

          // фолловеры по авторам из ленты
          const seen = new Set();
          data.forEach((post) => {
            const author = post.userId;
            const authorId = author?._id;
            if (!authorId || seen.has(authorId)) return;
            seen.add(authorId);

            dispatch(
              initialUserState({
                userId: authorId,
                isFollowedByCurrentUser: !!post.isAuthorFollowedByCurrentUser,
                followersCount: author.followersCount ?? 0,
              })
            );
          });
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "Unknown error";
        setErrorMsg(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeed();
  }, [dispatch]);

  // ⬇️ хендлер открытия поста
  const openPost = (post) => {
    // Если вдруг будет ворнинг про сериализацию — можно передавать «облегчённый» объект (postId, photo, text)
    dispatch(showPostModal(post));
  };

  const postItems = feed.map((item) => (
    <Element key={item._id} post={item} onOpen={() => openPost(item)} />
  ));

  return (
    <div className={styles.feedWrapper}>
      <div className={styles.feedGrid}>{postItems}</div>
      {isLoading && <Loader loading={isLoading} />}
      {errorMsg && <Error>{errorMsg}</Error>}
    </div>
  );
}

export default Main;