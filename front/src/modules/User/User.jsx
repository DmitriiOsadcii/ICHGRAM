import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";

import Profile from "../../shared/components/ProfileComponent/Profile";
import ProfilePost from "../../shared/components/PostsComponent/ProfilePost/ProfilePost";
import Loader from "../../shared/components/LoaderComponent/Loader";
import Error from "../../shared/components/ErrorComponent/Error";

import { getUserByIdApi } from "../../shared/api/user.api";
import { getPostsByUserApi } from "../../shared/api/post.api";
import { shwoLikes } from "../../redux/like/like.slice";
import { initialUserState } from "../../redux/follow/follow.slice";
import { selectAuthUser } from "../../redux/auth/auth.selectors";

import styles from "./User.module.css";

const emptyUser = {
  _id: "",
  email: "",
  fullName: "",
  username: "",
  followersCount: 0,
  followingCount: 0,
};

const User=()=> {
  const { id } = useParams();
  const dispatch = useDispatch();

  const authUser = useSelector(selectAuthUser);

  const [user, setUser] = useState(emptyUser);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);

  const [userPosts, setUserPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchProfileInfo = async () => {
      try {
        setIsUserLoading(true);
        setUserError(null);
        const data = await getUserByIdApi(id);
        if (data !== undefined) {
          setUser(data);
          dispatch(
            initialUserState({
              userId: data._id,
              isFollowedByCurrentUser: data.isFollowedByCurrentUser,
              followersCount: data.followersCount,
            })
          );
        }
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Unbekannter Fehler";
        setUserError(message);
      } finally {
        setIsUserLoading(false);
      }
    };

    fetchProfileInfo();
  }, [id, dispatch]);

  useEffect(() => {
    if (!id) return;
    const fetchPosts = async () => {
      try {
        setIsPostsLoading(true);
        setPostsError(null);
        const data = await getPostsByUserApi(id);
        if (data !== undefined) {
          setUserPosts(data);
          dispatch(shwoLikes(data));
        }
      } catch (err) {
        const message = err?.response?.data?.message || err?.message || "Unbekannter Fehler";
        setPostsError(message);
      } finally {
        setIsPostsLoading(false);
      }
    };

    fetchPosts();
  }, [id, dispatch]);

  const isCurrentUser = authUser?._id === user._id;

  return (
    <div className={styles.profileWrapper}>
      {user && <Profile user={user} posts={userPosts} isItMe={isCurrentUser} />}

      {isUserLoading && <Loader loading={isUserLoading} />}
      {userError && <Error>{userError}</Error>}

      <ProfilePost posts={userPosts} />

      {isPostsLoading && <Loader loading={isPostsLoading} />}
      {postsError && <Error>{postsError}</Error>}
    </div>
  );
}

export default User;