import styles from "./Privacy.module.css";
import { Link } from "react-router-dom";

const Privacy = () => {
    return (
        <div className={styles.privacy}>
            <p className={styles["privacy__text"]}>
                People who use our service may have uploaded your contact information to
                Instagram{" "}
                <Link to="/learn-more" className={styles["privacy__link"]}>
                    Learn More
                </Link>
            </p>

            <p className={styles["privacy__text"]}>
                By signing up, you agree to our{" "}
                <Link to="/terms" className={styles["privacy__link"]}>
                    Terms
                </Link>
                ,{" "}
                <Link to="/privacy-policy" className={styles["privacy__link"]}>
                    Privacy Policy
                </Link>{" "}
                and{" "}
                <Link to="/cookies-policy" className={styles["privacy__link"]}>
                    Cookies Policy
                </Link>
                .
            </p>
        </div>
    );
};

export default Privacy;