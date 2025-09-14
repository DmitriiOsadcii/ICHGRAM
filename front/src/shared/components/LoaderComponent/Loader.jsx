import { ClipLoader } from "react-spinners";
import styles from "./Loader.module.css"

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

const Loader = ({ loading }) => {
    
    return (
        <div className={styles.loaderContainer}>

            <ClipLoader
                loading={loading}
                color="#36d7b7"
                cssOverride={override}
                size={100}
                aria-label="Loading Spinner"
                data-testid="loader"
                className={styles.loaderBox}
            />
        </div>
    )
}
export default Loader;