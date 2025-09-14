import { useState, useEffect, useCallback, useRef } from "react";

import Loader from "../../../shared/components/LoaderComponent/Loader";
import Error from "../../../shared/components/ErrorComponent/Error";
import NotificationBoxItem from "./NotificationBoxItem/NotificationBoxItem";
import { getNotificationApi } from "../../../shared/api/notifications.api";

import styles from "./NotificationBox.module.css";

const LIMIT = 10;

function NotificationBox() {
  const [notifications, setNotifications] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // ВНЕ состояния — чтобы не попадать в зависимости эффектов/колбеков
  const isLoadingRef = useRef(false);
  const ioRef = useRef(null);
  const reqIdRef = useRef(0); // игнор устаревших ответов

  const resetList = () => {
    setNotifications([]);
    setPageIndex(1);
    setHasMorePages(true);
  };

  const loadNotifications = useCallback(async (pageToLoad) => {
    if (isLoadingRef.current) return;

    const id = ++reqIdRef.current;
    isLoadingRef.current = true;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await getNotificationApi(pageToLoad, LIMIT);
      if (reqIdRef.current !== id) return; // устаревший ответ

      const list = data?.notifications ?? [];
      // если сервер прислал некорректный hasMore — страхуемся локально
      const serverHasMore =
        typeof data?.hasMore === "boolean" ? data.hasMore : list.length === LIMIT;

      setNotifications((prev) =>
        pageToLoad === 1 ? list : [...prev, ...list]
      );
      setPageIndex(data?.page ?? pageToLoad);
      setHasMorePages(Boolean(serverHasMore));
    } catch (err) {
      if (reqIdRef.current !== id) return;
      const message = err?.response?.data?.message || err?.message || "Unknown error";
      setErrorMsg(message);
      // при ошибке дальше не пагинируем до ручного рефреша
      setHasMorePages(false);
    } finally {
      if (reqIdRef.current === id) {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    }
  }, []);

  // Первичная загрузка при маунте
  useEffect(() => {
    resetList();
    loadNotifications(1);
  }, [loadNotifications]);

  // Чистим IO при размонтировании
  useEffect(() => {
    return () => {
      if (ioRef.current) {
        ioRef.current.disconnect();
        ioRef.current = null;
      }
    };
  }, []);

  const handleLoadMore = useCallback(() => {
    if (isLoadingRef.current || !hasMorePages) return;
    loadNotifications(pageIndex + 1);
  }, [hasMorePages, loadNotifications, pageIndex]);

  const lastRowRef = useCallback(
    (node) => {
      if (ioRef.current) ioRef.current.disconnect();

      // если нечего наблюдать или больше страниц нет — просто выходим
      if (!node || !hasMorePages) return;

      ioRef.current = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !isLoadingRef.current && hasMorePages) {
          handleLoadMore();
        }
      });

      ioRef.current.observe(node);
    },
    [hasMorePages, handleLoadMore]
  );

  const items = notifications.map((item, index) => {
    const isLast = index === notifications.length - 1;
    return (
      <NotificationBoxItem
        key={item._id}
        note={item}
        ref={isLast ? lastRowRef : undefined}
      />
    );
  });

  const showEmpty =
    !isLoading && !errorMsg && notifications.length === 0;

  return (
    <div className={styles.ntfPanel}>
      <div className={styles.ntfHeader}>
        <h3 className={styles.title}>Notifications</h3>
        
      </div>

      <ul className={styles.ntfList}>{items}</ul>

      {showEmpty && (
        <div className={styles.empty}>No notifications</div>
      )}

      {isLoading && <Loader loading={isLoading} />}
      {errorMsg && <Error>{errorMsg}</Error>}
    </div>
  );
}

export default NotificationBox;