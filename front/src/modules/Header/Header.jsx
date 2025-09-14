import styles from "./Header.module.css"
import icon from "../../assets/icons/ICHGRA2.png"
import Menu from "./Menu/Menu"

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.image}>
                <img src={icon} alt="Ichgram" />
            </div>
            <Menu />
        </header>
    )
};

export default Header;