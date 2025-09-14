import styles from "./Error.module.css"
export const Error = ({ children }) => {
    return (
        <div className={styles.errorContainer}>
            <p className={styles.error}>{children}</p>
        </div>
    );
};

export default Error;