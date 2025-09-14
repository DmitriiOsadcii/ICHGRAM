import { Link } from "react-router-dom";
import { forwardRef } from "react";
import defaultAvatar from "../../../../assets/icons/avatar-default.svg";
import styles from "./SearchUser.module.css";

const SearchUser = forwardRef(({ user, onClick }, ref) => {
  return (
    <li className={styles["search-item"]} ref={ref}>
      <div className={styles["search-item__row"]}>
        <div className={styles["search-item__avatar-ring"]}>
          <img
            src={user.profilePhoto || defaultAvatar}
            alt={`${user.username} avatar`}
            className={styles["search-item__avatar"]}
          />
        </div>

        <div className={styles["search-item__meta"]}>
          {onClick ? (
            <button
              type="button"
              className={`${styles["search-item__username-btn"]} ${styles.prettyName}`}
              onClick={() => onClick(user)}
              aria-label={`Open profile ${user.username}`}
              title={user.username}
            >
              {user.username}
            </button>
          ) : (
            <Link
              to={`/users/${user._id}`}
              className={`${styles["search-item__username-link"]} ${styles.prettyName}`}
              title={user.username}
            >
              {user.username}
            </Link>
          )}

          <p className={styles["search-item__fullname"]}>{user.fullName}</p>
        </div>
      </div>
    </li>
  );
});

export default SearchUser;