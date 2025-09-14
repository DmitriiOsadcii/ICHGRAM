import { useState, useEffect, useCallback, useRef } from "react";
import { getUsersApi } from "../../api/user.api";

import Loader from "../LoaderComponent/Loader";
import Error from "../ErrorComponent/Error";
import SearchUser from "./SearchUser/SearchUser";
import removeIconUrl from "../../../assets/icons/removeIcon.svg";
import styles from "./Search.module.css";

const MIN_QUERY = 2;    // минимальная длина строки поиска
const LIMIT = 10;       // размер страницы
const DEBOUNCE = 300;   // мс

const Search = ({ onClick }) => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [failMsg, setFailMsg] = useState(null);

  const inputRef = useRef(null);
  const ioRef = useRef(null);
  const reqIdRef = useRef(0);        // счётчик запросов для игнора устаревших ответов
  const isBusyRef = useRef(false);   // флаг загрузки вне стейта (для loadMore/IO)

  const handleInput = (e) => setTerm(e.target.value);

  const resetList = () => {
    setResults([]);
    setPage(1);
    setHasMore(false);
  };

  const handleClear = () => {
    setTerm("");
    resetList();
    setFailMsg(null);
    if (ioRef.current) {
      ioRef.current.disconnect();
      ioRef.current = null;
    }
    inputRef.current?.focus();
  };

  // Поиск (первая страница) с дебаунсом и защитой от гонок
  useEffect(() => {
    const q = term.trim();

    // если строка слишком короткая — просто очистим и выйдем
    if (q.length < MIN_QUERY) {
      resetList();
      setFailMsg(null);
      setIsBusy(false);
      isBusyRef.current = false;
      return;
    }

    const id = ++reqIdRef.current;
    const timer = setTimeout(async () => {
      try {
        setIsBusy(true);
        isBusyRef.current = true;
        setFailMsg(null);

        const data = await getUsersApi(q, 1, LIMIT);
        if (reqIdRef.current !== id) return; // устаревший ответ

        setResults(data?.users ?? []);
        setPage(1);
        setHasMore(Boolean(data?.hasMore));
      } catch (err) {
        if (reqIdRef.current !== id) return;
        const msg = err?.response?.data?.message || err?.message || "Unknown error";
        setFailMsg(msg);
        resetList();
      } finally {
        if (reqIdRef.current === id) {
          setIsBusy(false);
          isBusyRef.current = false;
        }
      }
    }, DEBOUNCE);

    return () => clearTimeout(timer);
  }, [term]);

  // Догрузка следующих страниц
  const loadMore = useCallback(async () => {
    if (isBusyRef.current || !hasMore) return;

    const q = term.trim();
    if (q.length < MIN_QUERY) return;

    const id = ++reqIdRef.current;
    isBusyRef.current = true;
    setIsBusy(true);

    try {
      const nextPage = page + 1;
      const data = await getUsersApi(q, nextPage, LIMIT);
      if (reqIdRef.current !== id) return;

      setResults((prev) => [...prev, ...(data?.users ?? [])]);
      setPage(nextPage);
      setHasMore(Boolean(data?.hasMore));
    } catch (err) {
      if (reqIdRef.current !== id) return;
      setHasMore(false);
    } finally {
      if (reqIdRef.current === id) {
        setIsBusy(false);
        isBusyRef.current = false;
      }
    }
  }, [term, page, hasMore]);

  // IntersectionObserver для последнего элемента
  const tailRef = useCallback(
    (node) => {
      if (ioRef.current) ioRef.current.disconnect();

      if (!node || !hasMore) return;

      ioRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting && !isBusyRef.current && hasMore) {
          loadMore();
        }
      });

      ioRef.current.observe(node);
    },
    [hasMore, loadMore]
  );

  // Чистим IO при размонтировании
  useEffect(() => {
    return () => {
      if (ioRef.current) {
        ioRef.current.disconnect();
        ioRef.current = null;
      }
    };
  }, []);

  const items = results.map((user, idx) => {
    const isLast = idx === results.length - 1;
    return (
      <SearchUser
        key={user._id}
        user={user}
        ref={isLast ? tailRef : undefined}
        onClick={onClick}
      />
    );
  });

  const showEmpty =
    !isBusy &&
    !failMsg &&
    term.trim().length >= MIN_QUERY &&
    results.length === 0;

  return (
    <div>
      <div className={styles.searchBox}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          value={term}
          onChange={handleInput}
          className={styles.searchInput}
        />

        {term && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClear}
            aria-label="Clear search"
            title="Clear"
          >
            <img src={removeIconUrl} alt="" className={styles.clearIcon} />
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className={styles.contentBox}>
          <p className={styles.title}>Recent</p>
        </div>
      )}

      <ul className={styles.searchContainer}>{items}</ul>

      {showEmpty && <p className={styles.noResults}>No matching users found.</p>}
      {isBusy && <Loader loading={isBusy} />}
      {failMsg && <Error>{failMsg}</Error>}
    </div>
  );
};

export default Search;