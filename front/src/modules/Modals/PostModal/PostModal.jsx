import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import defaultAvatar from "../../../assets/icons/avatar-default.svg";

import PostComponent from "../../../shared/components/PostsComponent/Post";
import CommentComponent from "../../../shared/components/CommentComponent/CommentComponent";
import Box from "../../../shared/components/CommentContainerComponent/Box";
import Loader from "../../../shared/components/LoaderComponent/Loader";
import Error from "../../../shared/components/ErrorComponent/Error";

import more from "../../../assets/icons/more.svg";
import getTimeAgo from "../../../shared/utils/getTimeAgo";

import { selectLike } from "../../../redux/like/like.selectors";
import { toggleLikes } from "../../../redux/like/like.slice";
import { switchLike } from "../../../redux/like/like.thunks";
import { showEditModal, closeModal } from "../../../redux/modal/modal.slice";
import { getCommentsByIdApi, addCommentApi } from "../../../shared/api/comment.api";

import styles from "./PostModal.module.css";

const PostModal = ({ post }) => {
  const [commentList, setCommentList] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [isPostingComment, setIsPostingComment] = useState(false);
  const [errorMsgComment, setErrorMsgComment] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const likeState = useSelector(selectLike(post._id));

  const loadComments = useCallback(
    async (pageToLoad) => {
      if (isLoading) return;
      try {
        setIsLoading(true);
        setErrorMsg(null);
        const data = await getCommentsByIdApi(post._id, pageToLoad);
        if (data !== undefined) {
          setPageIndex(data.page);
          setHasMorePages(data.hasMore);
          setCommentList((prev) =>
            pageToLoad === 1 ? data.comments : [...prev, ...data.comments]
          );
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "Unbekannter Fehler";
        setErrorMsg(message);
      } finally {
        setIsLoading(false);
      }
    },
    [post._id, isLoading] // если хочешь – можешь вернуть hasMorePages обратно
  );

  // первый запрос + сброс при смене поста
  useEffect(() => {
    setCommentList([]);
    setPageIndex(1);
    setHasMorePages(true);
    setErrorMsg(null);
    loadComments(1);
  }, [post._id]);

  const openMoreMenu = (event) => {
    event.preventDefault();
    dispatch(showEditModal({ type: "editSelection", postData: post }));
  };

  const handleLikeToggle = () => {
    dispatch(toggleLikes({ postId: post._id }));
    dispatch(switchLike({ postId: post._id }));
  };

  const handleGoToUser = (event) => {
    event.preventDefault();
    dispatch(closeModal());
    navigate(`/users/${post.userId._id}`);
  };

  const handleSubmitComment = async (payload) => {
    try {
      setIsPostingComment(true);
      setErrorMsgComment(null);
      const data = await addCommentApi(post._id, payload);
      if (data !== undefined) {
        setCommentList((prev) => [data, ...prev]);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Unbekannter Fehler";
      setErrorMsgComment(message);
    } finally {
      setIsPostingComment(false);
    }
  };

  const postAgeLabel = getTimeAgo(post.updatedAt ?? 0);

  return (
    <div className={styles.conteiner}>
      {errorMsg && <Error>{errorMsg}</Error>}

      <div className={styles.imageContainer}>
        <img src={post.photo} alt="post" className={styles.image} />
      </div>

      <div className={styles.postConteiner}>
        {/* header */}
        <div className={styles.titleBox}>
          <div className={styles.usernameBox}>
            {/* Аватар (header) */}
            <div className={`${styles.avatarRing} ${styles.md}`}>
              <img
                src={post.userId.profilePhoto || defaultAvatar}
                alt={`${post.userId.username} avatar`}
                className={styles.avatarImg}
              />
              {/* <span className={styles.avatarStatus} aria-hidden="true" /> */}
            </div>

            <button className={styles.btnLink} onClick={handleGoToUser}>
              <p className={styles.username}>{post.userId.username}</p>
            </button>
          </div>

          <button className={styles.iconBtnBox} onClick={openMoreMenu}>
            <img src={more} alt="more" />
          </button>
        </div>

        <div className={styles.postDescriptionContainer}>
          <div className={styles.postDescriptionBox}>
            {/* Аватар (в описании) — немного крупнее */}
            <div className={`${styles.avatarRing} ${styles.lg}`}>
              <img
                src={post.userId.profilePhoto || defaultAvatar}
                alt={`${post.userId.username} avatar`}
                className={styles.avatarImg}
              />
              {/* <span className={styles.avatarStatus} aria-hidden="true" /> */}
            </div>

            <div className={styles.postBox}>
              <div className={styles.post}>
                <p>
                  <span className={styles.usernameText}>
                    {post.userId.username}
                  </span>
                  <span>{post.text}</span>
                </p>
              </div>
              <p className={styles.infoData}>{postAgeLabel}</p>
            </div>
          </div>

          {/* comments */}
          <div className={styles.commentsBox}>
            <Box
              comments={commentList}
              hasMore={hasMorePages}
              loading={isLoading}
              onLoadMore={() => loadComments(pageIndex + 1)}
            />
            {isLoading && commentList.length === 0 && <Loader loading={true} />}
          </div>
        </div>

        {/* footer: likes + meta */}
        <div className={styles.postInfoBox}>
          <PostComponent
            likesAmount={likeState?.likesCount ?? post.likesCount}
            liked={likeState?.isLiked ?? !!post.isLikedByCurrentUser}
            onToggle={handleLikeToggle}
          />
          <div className={styles.infoBox}>
            <p className={styles.infoData}>{postAgeLabel}</p>
          </div>
        </div>

        {/* add comment */}
        <div className={styles.addCommentBox}>
          <CommentComponent submitForm={handleSubmitComment} />
          {isPostingComment && <Loader loading={true} />}
          {errorMsgComment && <Error>{errorMsgComment}</Error>}
        </div>
      </div>
    </div>
  );
};

export default PostModal;