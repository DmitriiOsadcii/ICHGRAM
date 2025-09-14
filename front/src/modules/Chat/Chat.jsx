import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { connectSocket, getSocket, disconnectSocket, waitUntilConnected } from "../../shared/ws/socket";
import { store } from "../../redux/store";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const subsNewMsg = useRef(new Set());
  const subsTyping = useRef(new Set());

  useEffect(() => {
    const { socket } = connectSocket(store.getState);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleNew = (msg) => subsNewMsg.current.forEach((cb) => cb(msg));
    const handleTyping = (e) => subsTyping.current.forEach((cb) => cb(e));

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("chat:new_message", handleNew);
    socket.on("chat:typing", handleTyping);
    socket.on("connect_error", (err) => {
      console.error("connect_error:", err?.message || err);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("chat:new_message", handleNew);
      socket.off("chat:typing", handleTyping);
      disconnectSocket();
    };
  }, []);

  const api = useMemo(
    () => ({
      connected,
      join: async (otherUserId) => {
        await waitUntilConnected();
        return new Promise((resolve) => {
          getSocket().emit("chat:join", { otherUserId }, (resp) => resolve(resp));
        });
      },
      load: async (conversationId, page = 1, limit = 20) => {
        await waitUntilConnected();
        return new Promise((resolve) => {
          getSocket().emit("chat:load", { conversationId, page, limit }, (resp) => resolve(resp));
        });
      },
      send: async ({ conversationId, toUserId, text }) => {
        await waitUntilConnected();
        return new Promise((resolve) => {
          getSocket().emit("chat:send", { conversationId, toUserId, text }, (resp) => resolve(resp));
        });
      },
      read: async (conversationId) => {
        await waitUntilConnected();
        getSocket().emit("chat:read", { conversationId });
      },
      typing: async (conversationId, isTyping) => {
        await waitUntilConnected();
        getSocket().emit("chat:typing", { conversationId, isTyping });
      },
      onNewMessage: (cb) => {
        subsNewMsg.current.add(cb);
        return () => subsNewMsg.current.delete(cb);
      },
      onTyping: (cb) => {
        subsTyping.current.add(cb);
        return () => subsTyping.current.delete(cb);
      },
    }),
    [connected]
  );

  return <ChatContext.Provider value={api}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within <ChatProvider>");
  return ctx;
}