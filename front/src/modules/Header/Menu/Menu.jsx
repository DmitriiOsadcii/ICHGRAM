import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import menu from "../../../shared/data/menu";

import { selectAuthUser } from "../../../redux/auth/auth.selectors";
import { showModal } from "../../../redux/modal/modal.slice";

import defaultAvatar from "../../../assets/icons/avatar-default.svg";

import styles from "./Menu.module.css";

const Menu = () => {
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const openModal = (e, type) => {
    e.preventDefault();
    dispatch(showModal(type));
  };

  const openPanel = (e, to, extraState = {}) => {
    e.preventDefault();
    navigate(to, {
      state: {
        backgroundLocation: location,
        ...extraState,
        _k: Date.now(),
      },
    });
  };

  return (
    <div className="container">
      <ul className={styles.navList}>
        {menu.map((item) => {
          const isModal = item.type === "modal";
          const isMessages = item.href === "/messages";
          const to = item.href;

          let onClick = undefined;
          if (isModal) {
            onClick = (e) => openModal(e, item.modalType);
          } else if (isMessages) {
            onClick = (e) => openPanel(e, to, { showPanel: "messages" });
          } else if (item.openAsPanel) {
            onClick = (e) => openPanel(e, to);
          }

          const Icon = item.icon;

          return (
            <li key={item.id} className={styles.navItem}>
              <NavLink
                to={to}
                state={undefined} // state задаём через navigate в onClick
                onClick={onClick}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={styles.icon} />
                    <p
                      className={`${styles.text} ${
                        isActive ? styles.underline : ""
                      }`}
                    >
                      {item.text}
                    </p>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}

        <NavLink
          to="/api/profile"
          className={({ isActive }) =>
            `${styles.link} ${styles.profileContainer} ${
              isActive ? styles.active : ""
            }`
          }
        >
          <div className={styles.profileWrap}>
            <div className={styles.avatarBorder}>
              <img
                width={50}
                src={user?.profilePhoto || defaultAvatar}
                alt="User avatar"
                className={styles.avatarImage}
              />
            </div>
            <p className={styles.text}>Profile</p>
          </div>
        </NavLink>
      </ul>
    </div>
  );
};

export default Menu;