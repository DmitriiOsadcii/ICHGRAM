import styles from "./NotFound.module.css";

const  NotFound=()=> {
  return (
    <div className={styles.notfoundWrapper}>
      <div className={styles.notfoundImageBox}>
        <img
          className={styles.notfoundImage}
          src="/image/Background.png"
          alt="Background"
        />
      </div>

      <div className={styles.notfoundContent}>
        <h2 className={styles.notfoundTitle}>
          Oops! Page Not Found (404 Error)
        </h2>
        <p className={styles.notfoundText}>
          We're sorry, but the page you're looking for doesn't seem to exist.{" "}
          <br /> If you typed the URL manually, please double-check the
          spelling. <br /> If you clicked on a link, it may be outdated or
          broken.
        </p>
      </div>
    </div>
  );
}

export default NotFound;