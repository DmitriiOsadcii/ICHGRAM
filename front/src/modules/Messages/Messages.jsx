import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import defaultAvatar from "../../assets/icons/avatar-default.svg";
import { selectAuthUser } from "../../redux/auth/auth.selectors";
import { useChat } from "../../modules/Chat/Chat";
import styles from "./Messages.module.css";

function Messages({ user }) {
  const authUser = useSelector(selectAuthUser);
  const { join, load, send, read, typing, onNewMessage, onTyping } = useChat();

  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [draft, setDraft] = useState("");
  const [otherTyping, setOtherTyping] = useState(false);

  const listRef = useRef(null);
  const typingTimer = useRef(null);
  const activeConvRef = useRef(null);     // чтобы отфильтровать устаревшие ответы
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
        typingTimer.current = null;
      }
    };
  }, []);

  // join dialog on user change
  useEffect(() => {
    let offNew = null;
    let offTyping = null;
    let cancelled = false;

    (async () => {
      if (!user?._id) return;

      // сбрасываем локальное состояние при смене собеседника
      setMessages([]);
      setPage(1);
      setHasMore(true);
      setOtherTyping(false);
      setDraft("");

      const j = await join(user._id);
      if (cancelled || !j?.ok || !j.conversationId) return;

      setConversationId(j.conversationId);
      activeConvRef.current = j.conversationId;

      const hist = await load(j.conversationId, 1, 20);
      if (!cancelled && hist?.ok) {
        const arr = (hist.messages ?? hist.conversation) || [];
        setMessages(arr);
        setHasMore(!!hist.hasMore);
        read(j.conversationId);

        queueMicrotask(() => {
          if (listRef.current) {
            listRef.current.scrollTo({ top: listRef.current.scrollHeight });
          }
        });
      }

      offNew = onNewMessage((msg) => {
        // фильтруем чужие диалоги и устаревшие подписки
        if (!msg || msg.conversationId !== activeConvRef.current) return;
        setMessages((prev) => [...prev, msg]);
        queueMicrotask(() => {
          if (listRef.current) {
            listRef.current.scrollTo({
              top: listRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        });
      });

      offTyping = onTyping((e) => {
        if (
          !e ||
          e.conversationId !== activeConvRef.current ||
          e.userId === authUser?._id
        ) {
          return;
        }
        setOtherTyping(!!e.isTyping);
      });
    })();

    return () => {
      cancelled = true;
      if (offNew) offNew();
      if (offTyping) offTyping();
      if (typingTimer.current) {
        clearTimeout(typingTimer.current);
        typingTimer.current = null;
      }
    };
  }, [user?._id, authUser?._id, join, load, onNewMessage, onTyping, read]);

  const loadMore = async () => {
    if (!conversationId || !hasMore) return;

    // сохраняем высоту до загрузки, чтобы удержать позицию скролла
    const el = listRef.current;
    const prevScrollHeight = el ? el.scrollHeight : 0;

    const next = page + 1;
    const hist = await load(conversationId, next, 20);
    if (hist?.ok) {
      const arr = (hist.messages ?? hist.conversation) || [];
      setMessages((prev) => [...arr, ...prev]); // prepend
      setPage(next);
      setHasMore(!!hist.hasMore);

      queueMicrotask(() => {
        if (el) {
          const diff = el.scrollHeight - prevScrollHeight;
          el.scrollTop = diff + el.scrollTop; // удерживаем видимую позицию
        }
      });
    }
  };

  const onChangeDraft = (e) => {
    const v = e.target.value;
    setDraft(v);

    if (conversationId) {
      typing(conversationId, true);
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        typingTimer.current = null;
        // проверяем, что компонент всё ещё смонтирован
        if (mountedRef.current) {
          typing(conversationId, false);
        }
      }, 1000);
    }
  };

  const onSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !conversationId) return;

    setDraft("");
    const resp = await send({ conversationId, text });
    if (!resp?.ok) {
      // TODO: показать ошибку пользователю
    }
    // сообщение прилетит через onNewMessage
  };

  return (
    <div className={styles.chatWrapper}>
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderRow}>
          <div className={styles.chatAvatarRing}>
            <img
              src={user?.profilePhoto || defaultAvatar}
              alt="user"
              className={styles.chatAvatar}
            />
          </div>
          <div className={styles.chatUserMeta}>
            <p className={styles.chatUsername}>{user?.username || "User"}</p>
            {otherTyping && <p className={styles.chatTyping}>typing…</p>}
          </div>
        </div>
      </div>

      <div className={styles.chatThread} ref={listRef}>
        {hasMore && (
          <button className={styles.loadMore} onClick={loadMore}>
            Load earlier messages
          </button>
        )}

        {messages.map((m) => {
          const mine = m.senderId === authUser?._id;
          return mine ? (
            <div key={m._id} className={`${styles.chatRow} ${styles.chatRowSender}`}>
              <div className={`${styles.chatBubble} ${styles.chatBubbleSender}`}>
                <p className={styles.chatSenderText}>{m.text}</p>
              </div>
              <div className={`${styles.chatBubbleAvatar} ${styles.chatSenderAvatar}`}>
                <img
                  src={authUser?.profilePhoto || defaultAvatar}
                  alt="me"
                  className={styles.chatAvatar}
                />
              </div>
            </div>
          ) : (
            <div key={m._id} className={`${styles.chatRow} ${styles.chatRowRecipient}`}>
              <div className={`${styles.chatBubbleAvatar} ${styles.chatRecipientAvatar}`}>
                <img
                  src={user?.profilePhoto || defaultAvatar}
                  alt="user"
                  className={styles.chatAvatar}
                />
              </div>
              <div className={`${styles.chatBubble} ${styles.chatBubbleRecipient}`}>
                <p className={styles.chatRecipientText}>{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form className={styles.chatComposer} onSubmit={onSend}>
        <input
          type="text"
          placeholder="Write message"
          className={styles.chatInput}
          value={draft}
          onChange={onChangeDraft}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              // поведение мессенджеров: Enter = отправка
              e.preventDefault();
              onSend(e);
            }
          }}
        />
        <button
          className={styles.chatBtn}
          type="submit"
          disabled={!draft.trim() || !conversationId}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Messages;