import { Link } from "react-router-dom";
import Button from "../ButtonComponent/Button";
import FollowButton from "../ButtonComponent/Follow/FollowButton";
import { useSelector } from "react-redux";
import defaultAvatar from "../../../assets/icons/avatar-default.svg"

import { selectFollowByUserId } from "../../../redux/follow/follow.selectors"
import linkSvg from "../../../assets/icons/link.svg"

import styles from "./Profile.module.css"

const Profile = ({ user, isItMe = false, posts }) => {

    const followData = useSelector(selectFollowByUserId(user._id));

const followers =
  followData?.followersCount ??
  followData?.followers ??
  user?.followersCount ??
  (Array.isArray(user?.followers) ? user.followers.length : undefined) ??
  0;

const following =
  followData?.followersCount ??
  followData?.isFollowing ??
  user?.followingCount ??
  (Array.isArray(user?.following) ? user.following.length : undefined) ??
  0;

    return (
        <section className={styles.profile}>
            <div className={styles["profile__avatar-ring"]}>
                <img
                    src={user.profilePhoto || defaultAvatar}
                    alt={`${user.username}'s profile`}
                    className={styles["profile__avatar"]}
                />
            </div>

            <div className={styles["profile__content"]}>
                <div className={styles["profile__header"]}>
                    <h1 className={styles["profile__username"]}>{user.username}</h1>

                    {isItMe ? (
                        <Link to="/api/profile/edit-profile">
                            <Button children="Edit profile" variant="secondary" />
                        </Link>
                    ) : (
                        <div className={styles["profile__actions"]}>
                            <FollowButton
                                userId={user._id}
                                initiallyFollowed={user.isFollowedByCurrentUser}
                                initialFollowersCount={user.followersCount}
                                variantWhenFollowing="secondary"
                                variantWhenNotFollowing="primary"
                            />
                            <Button variant="secondary">Message</Button>
                        </div>
                    )}
                </div>

                <div className={styles["profile__stats"]}>
                    <div className={styles["profile__stat"]}>
                        <span className={styles["profile__stat-value"]}>{posts.length}</span>
                        <p className={styles["profile__stat-label"]}>posts</p>
                    </div>
                    <div className={styles["profile__stat"]}>
                        <span className={styles["profile__stat-value"]}>{followers}</span>
                        <p className={styles["profile__stat-label"]}>followers</p>
                    </div>
                    <div className={styles["profile__stat"]}>
                        <span className={styles["profile__stat-value"]}>{user.following}</span>
                        <p className={styles["profile__stat-label"]}>following</p>
                    </div>
                </div>

                <div className={styles["profile__bio"]}>
                    <p className={styles["profile__fullname"]}>{user.fullName}</p>
                    <p>{user.biography}</p>
                </div>

                {user.website && (
                    <div className={styles["profile__link"]}>
                        <img src={linkSvg} alt="" aria-hidden="true" />
                        <a href={user.website} target="_blank" rel="noopener noreferrer">
                            {user.website}
                        </a>
                    </div>
                )}
            </div>
        </section>
    )
}
export default Profile;