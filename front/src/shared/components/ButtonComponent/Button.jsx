import styles from "./Button.module.css"

const Button = ({ children, width, onClick }) => {

    return (
        <button onClick={onClick} className={styles.button} width={width}>{children}</button>
    )
}

export default Button;