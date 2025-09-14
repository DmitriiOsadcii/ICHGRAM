import ForgotPassword from "../../modules/ForgotPassword/ForgotPassword";
import styles from "./ForgotPasswordPage.module.css"

const ForgotPasswordPage = () => {
    return (
        <main className="layout">
            <div className={styles.container}>
                <div className="wrapper">
                <ForgotPassword />
                </div>
            </div>
        </main>
    )
}

export default ForgotPasswordPage;