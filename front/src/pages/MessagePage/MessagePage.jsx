import { useLocation, useSearchParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getUserByIdApi } from "../../shared/api/user.api";
import Loader from "../../shared/components/LoaderComponent/Loader";
import Error from "../../shared/components/ErrorComponent/Error";
import Messages from "../../modules/Messages/Messages";

function MessagesPage() {
  const location = useLocation();
  const navUser = location.state?.toUser;

  const [searchParams] = useSearchParams();
  const toUserId = searchParams.get("to") || undefined;

  const [chatUser, setChatUser] = useState(navUser || null);
  const [loading, setLoading] = useState(false);
  const [failMsg, setFailMsg] = useState(null);

  // Панельный режим, если есть backgroundLocation или явный флаг
  const panelMode =
    !!location.state?.backgroundLocation || location.state?.showPanel === "messages";

  useEffect(() => {
    if (navUser?._id) setChatUser(navUser);
  }, [navUser?._id]);

  useEffect(() => {
    if (chatUser || !toUserId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setFailMsg(null);
        const data = await getUserByIdApi(toUserId);
        if (!cancelled) setChatUser(data);
      } catch (e) {
        if (!cancelled) setFailMsg(e?.message || "Failed to load user");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [toUserId, chatUser]);

  // ⛔️ Главное изменение: НЕ редиректим, если открыто как панель
  if (!chatUser && !toUserId && !navUser) {
    return panelMode ? null : <Navigate to="/messages" replace />;
  }

  if (loading) return <Loader loading />;
  if (failMsg) return <Error>{failMsg}</Error>;
  if (!chatUser) return null;

  return (
    <main>
      <div className="container">
        <Messages user={chatUser} />
      </div>
    </main>
  );
}

export default MessagesPage;