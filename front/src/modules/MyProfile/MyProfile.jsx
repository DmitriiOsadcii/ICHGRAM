import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Profile from "../../shared/components/ProfileComponent/Profile";
import ProfilePost from "../../shared/components/PostsComponent/ProfilePost/ProfilePost";
import Loader from "../../shared/components/LoaderComponent/Loader";
import Error from "../../shared/components/ErrorComponent/Error";
import {useDispatch} from "react-redux";

import { getMyProfileApi } from "../../shared/api/myProfile.api";
import { getMyPostsApi } from "../../shared/api/post.api";
import { shwoLikes } from "../../redux/like/like.slice";

import styles from "./MyProfile.module.css";

const emptyUser = {
  _id: "",
  email: "",
  fullName: "",
  username: "",
  followersCount: 0,
  followingCount: 0,
};

function MyProfile() {
  const location = useLocation();
  const refreshKey = location.state?.refreshPosts;

  const dispatch = useDispatch();

  const [me, setMe] = useState(emptyUser);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);

  const [myPosts, setMyPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);

  useEffect(() => {
    const loadMyProfile = async () => {
      try {
        setIsUserLoading(true);
        setUserError(null);
        const data = await getMyProfileApi();
        if (data !== undefined) {
          setMe(data);
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "UNDEFINED error";
        setUserError(message);
      } finally {
        setIsUserLoading(false);
      }
    };

    loadMyProfile();
  }, []);

  useEffect(() => {
    const loadMyPosts = async () => {
      try {
        setIsPostsLoading(true);
        setPostsError(null);
        const data = await getMyPostsApi();
        if (data !== undefined) {
          setMyPosts(data);
          dispatch(shwoLikes(data));
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || err?.message || "UNDEFINED error";
        setPostsError(message);
      } finally {
        setIsPostsLoading(false);
      }
    };

    loadMyPosts();
  }, [refreshKey, dispatch]);

  return (
    <div className={styles.profileWrapper}>
      {me && <Profile isItMe user={me} posts={myPosts} />}

      {isUserLoading && <Loader loading={isUserLoading} />}
      {userError && <Error>{userError}</Error>}

      <ProfilePost posts={myPosts} />

      {isPostsLoading && <Loader loading={isPostsLoading} />}
      {postsError && <Error>{postsError}</Error>}
    </div>
  );
}

export default MyProfile;