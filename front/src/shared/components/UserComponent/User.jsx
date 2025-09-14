import styles from "./User.module.css"

import avatar from "../../../assets/icons/avatar-default.svg"


const User = ({ user, onClick }) => {
    return (
        <li className={styles.result}>
            <div className={styles.result_inner}>
                <div className={styles.result_avatarBox}>
                    <img className={styles.result_avatar} src={user.profilePhoto || avatar} alt="default" />
                </div>
                <div className={styles.result_info}>
                    <button className={styles.result_usernameBtn} type="button" onClick={() => onClick(user)}>{user.username}</button>
                </div>
                <p className={styles.result_fullName}>{user.fullName}</p>
            </div>
        </li>
    )
}

export default User;