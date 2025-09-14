import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";

import { selectFollowByUserId } from "../../../../redux/follow/follow.selectors";
import { initialUserState } from "../../../../redux/follow/follow.slice";
import { followUser, unfollowUser } from "../../../../redux/follow/follow.thunks";


const FollowButton = ({
  userId,
  initiallyFollowed = false,
  initialFollowersCount = 0,
  variantWhenFollowing = "secondary",
  variantWhenNotFollowing = "primary",
  width,
}) => {
  const dispatch = useDispatch();
  const item = useSelector(selectFollowByUserId(userId)); // { isFollowing, followersCount, loading, error }

  // Если в сторе ещё нет записи по userId — инициализируем её из пропов
  useEffect(() => {
    if (!item) {
      dispatch(
        initialUserState({
          id: userId,
          isFollowed: initiallyFollowed,
          followersCount: initialFollowersCount,
        })
      );
    }
  }, [item, userId, initiallyFollowed, initialFollowersCount, dispatch]);

  const isFollowing = item?.isFollowing ?? initiallyFollowed;
  const loading = item?.loading ?? false;

  const text = isFollowing ? "Unfollow" : "Follow";
  const variant = isFollowing ? variantWhenFollowing : variantWhenNotFollowing;

  const onClick = () => {
    if (loading) return;
    if (isFollowing) {
      dispatch(unfollowUser({ id: userId }));
    } else {
      dispatch(followUser({ id: userId }));
    }
  };

  return (
    <Button onClick={onClick} disabled={loading} variant={variant} width={width}>
      {text}
    </Button>
  );
};

export default FollowButton;