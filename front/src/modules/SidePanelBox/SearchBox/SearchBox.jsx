import Search from "../../../shared/components/SearchComponent/Search";

import styles from "./SearchBox.module.css";

const SearchBox=()=> {
  return (
    <div className={styles.searchPanel}>
      <div className={styles.searchHeader}>
        <h3 className={styles.title}>Search</h3>
      </div>
      <Search />
    </div>
  );
}

export default SearchBox;
