import styles from "./Footer.module.css"
import { Link } from "react-router-dom"

const Footer = ({ className,link, text, children }) => {
    return (
        <div className={`${styles.root} ${className ?? ""}`}>
            <p className={styles.signup}>{children}</p>
            <Link className={styles.link} to={link}>
                {text}
            </Link>
        </div>
    )
}
export default Footer;