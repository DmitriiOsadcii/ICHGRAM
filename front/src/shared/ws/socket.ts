import { io, Socket } from "socket.io-client";
import type { RootState } from "../../redux/store";

let socket: Socket | null = null;
let ready: Promise<void> | null = null;

export function connectSocket(
  getState: () => RootState
): { socket: Socket; ready: Promise<void> } {
  const token = getState().auth.token;
  const url = import.meta.env.VITE_WS_URL;

  socket = io(url, {
    auth: token ? { token } : undefined, // токен через auth
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 800,
  });

  ready = new Promise<void>((resolve, reject) => {
    const onConnect = () => {
      socket!.off("connect_error", onErr);
      resolve();
    };
    const onErr = (err: Error) => {
      // у события корректный тип Error
      console.error("socket connect_error:", err.message);
      socket!.off("connect", onConnect);
      reject(err);
    };

    socket!.once("connect", onConnect);
    socket!.once("connect_error", onErr);
  });

  socket.connect();
  return { socket: socket!, ready: ready! };
}

export function getSocket(): Socket {
  if (!socket) throw new Error("Socket is not connected yet");
  return socket;
}

export function waitUntilConnected(): Promise<void> {
  if (socket?.connected) return Promise.resolve();
  if (ready) return ready;
  return Promise.reject(new Error("Socket is not initialized"));
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    ready = null;
  }
}