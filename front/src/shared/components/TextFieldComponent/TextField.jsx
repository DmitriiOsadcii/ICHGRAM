import styles from "./TextField.module.css";

function TextField({ name, register, rules, error, ...props }) {
  // на случай, если register не передали (чтобы не упасть)
  const registerProps = register ? register(name, rules) : {};

  const hasError = Boolean(error);
  const errorId = hasError ? `${name}-error` : undefined;

  return (
    <div className={styles.authFieldRow}>
      <input
        {...registerProps}
        {...props}
        aria-invalid={hasError}
        aria-describedby={errorId}
        className={`${styles.authInput} ${hasError ? styles.authInputError : ""}`}
      />
      {hasError && (
        <p id={errorId} role="alert" className={styles.authErrorText}>
          {String(error?.message || "")}
        </p>
      )}
    </div>
  );
}

export default TextField;