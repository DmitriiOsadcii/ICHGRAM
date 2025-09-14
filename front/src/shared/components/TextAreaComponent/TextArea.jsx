import styles from "./TextArea.module.css"

const TextArea = ({ name, label, rules, register, error, isLink, IsTextArea, maxLength, valueLength , ...props}) => {

    return (
        <div className={styles.field}>
            <label htmlFor={name} className={styles.field__label}>{label}</label>

            {IsTextArea ? (<textarea className={`${styles.field__input} ${styles["field__input--textarea"]}`} {...register(name, rules)} {...props} maxLength={maxLength} />)
                : isLink ? (<input {...register(name, rules)} {...props} className={`${styles.field__input} ${styles.field__link}`} />) : (<input className={styles.field__input} {...register(name, rules)} {...props} />)}

            {maxLength !== undefined && (
                <div className={styles.field__counter}>
                    {valueLength || 0} / {maxLength}
                </div>
            )}

            {error && <p className={styles.field__error}>{error.message}</p>}
        </div>

    )
}

export default TextArea;
