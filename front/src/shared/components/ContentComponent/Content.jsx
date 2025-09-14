import { Link } from "react-router-dom";
import styles from "./Content.module.css"

import icon from "../../../assets/icons/ICHGRA2.png"

const Content = ({
    children,
    showLogo = false,
    headerIcon,
    message,
    title,
    description,
    linkHref,
    linkLabel,
    showOrDivider = false,
    authLinkLabel,
    authLinkHref,
}) => {
    return (
        <div className={styles["auth-card"]}>
            {showLogo && (
                <div className={styles["auth-card__logo"]}>
                    <img src={icon} alt="Ichgram" />
                </div>
            )}
            {headerIcon && <div className={styles["auth-card__icon"]}>{headerIcon}</div>}
            {message && (
                <div className={styles["auth-card__message-wrap"]}>
                    <p className={styles["auth-card__message"]}>{message}</p>
                </div>
            )}
            {title && description && (
                <div className={styles["auth-card__text-group"]}>
                    <p className={styles["auth-card__title"]}>{title}</p>
                    <p className={styles["auth-card__description"]}>{description}</p>
                </div>
            )}
            {children}
            {showOrDivider && (
                <div className={styles["auth-card__divider"]}>
                    <div className={styles["auth-card__divider-line"]} />
                    <p className={styles["auth-card__divider-text"]}>OR</p>
                    <div className={styles["auth-card__divider-line"]} />
                </div>
            )}
            {linkHref && (
                <div className={styles["auth-card__link-row"]}>
                    <Link to={linkHref} className={styles["auth-card__link"]}>
                        {linkLabel}
                    </Link>
                </div>
            )}
            {authLinkLabel && authLinkHref && (
                <>{<Link to={authLinkHref}>{authLinkLabel}</Link>}</>
            )}
        </div>
    );
};

export default Content;