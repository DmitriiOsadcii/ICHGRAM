import { Server as WsServer, Socket } from "socket.io";
import { createServer, Server } from "node:http";
import mongoose, { Types } from "mongoose";
import { wsServerBearer } from "./utils/wsServerBearer";

import HttpExeption from "./utils/HttpExeption";
import {
  getOrCreateConversation,
  getMessages,
  addMessage,
  markRead,
} from "./services/chat.service";

declare module "socket.io" {
  interface Socket {
    userId?: Types.ObjectId;
  }
}

const socketPort: number = Number(process.env.SOCKET_PORT || 5000);

// Разрешим список фронтендов (через запятую). Например:
// FRONTEND_URLS=http://localhost:5173,http://127.0.0.1:5173
const FRONTENDS = (process.env.FRONTEND_URLS ?? process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

const startWsServer = (): void => {
  const httpServer: Server = createServer();

  const wsServer = new WsServer(httpServer, {
    cors: {
      origin: FRONTENDS,
      credentials: true,
    },
  });

  // --- AUTH middleware ---
  wsServer.use(async (socket: Socket, next) => {
    try {
      const token: string | undefined = socket.handshake.auth?.token as string | undefined;
      console.log("WS handshake token:", token ? token.slice(0, 12) + "…" : "none");
      if (!token) throw HttpExeption(401, "No token");

      // твой валидатор ожидает Bearer <token>
      const user = await wsServerBearer(`Bearer ${token}`);

      socket.userId = user._id;
      socket.join(`user:${user._id.toString()}`);
      next();
    } catch (error: any) {
      console.error("WS auth failed:", error?.message || error);
      next(HttpExeption(401, "Auth failed"));
    }
  });

  wsServer.on("connection", (socket: Socket): void => {
    console.log("WS connected:", socket.id, "user:", socket.userId?.toString());

    const me = socket.userId;
    if (!me) {
      console.warn("No userId on connection, disconnecting", socket.id);
      socket.emit("error", "unauthorized");
      socket.disconnect(true);
      return;
    }

    // ---- JOIN / CREATE DIALOG ----
    socket.on(
      "chat:join",
      async ({ otherUserId }: { otherUserId: string }, cb) => {
        try {
          const other = new mongoose.Types.ObjectId(otherUserId);
          const conv = await getOrCreateConversation(me, other);
          const room = `conv:${conv._id.toString()}`;
          socket.join(room);
          cb?.({
            ok: true,
            conversationId: conv._id,
            lastMessageText: (conv as any).lastMessageText,
            lastMessageAt: (conv as any).lastMessageAt,
          });
        } catch (e: any) {
          cb?.({ ok: false, error: e.message });
        }
      }
    );

    // ---- LOAD MESSAGES (pagination) ----
    socket.on(
      "chat:load",
      async (
        {
          conversationId,
          page,
          limit,
        }: { conversationId: string; page?: number; limit?: number },
        cb
      ) => {
        try {
          const cid = new mongoose.Types.ObjectId(conversationId);
          const data = await getMessages(cid, page, limit);
          cb?.({ ok: true, ...data }); // { ok, messages, page, limit, hasMore }
        } catch (e: any) {
          cb?.({ ok: false, error: e.message });
        }
      }
    );

    // ---- SEND MESSAGE ----
    socket.on(
      "chat:send",
      async (
        {
          conversationId,
          text,
          toUserId,
        }: { conversationId?: string; text: string; toUserId?: string },
        cb
      ) => {
        try {
          let convId: Types.ObjectId;
          if (conversationId) {
            convId = new mongoose.Types.ObjectId(conversationId);
          } else if (toUserId) {
            const other = new mongoose.Types.ObjectId(toUserId);
            const conv = await getOrCreateConversation(me, other);
            convId = conv._id;
          } else {
            throw new Error("conversationId or toUserId is required");
          }

          const msg = await addMessage(convId, me, text);
          const room = `conv:${convId.toString()}`;

          wsServer.to(room).emit("chat:new_message", {
            _id: msg._id,
            conversationId: msg.conversationId,
            senderId: msg.senderId,
            text: msg.text,
            createdAt: msg.createdAt,
          });

          if (toUserId) {
            wsServer.to(`user:${toUserId}`).emit("chat:notify", {
              conversationId: convId,
            });
          }

          cb?.({ ok: true, conversationId: convId, messageId: msg._id });
        } catch (e: any) {
          cb?.({ ok: false, error: e.message });
        }
      }
    );

    // ---- READ ----
    socket.on("chat:read", async ({ conversationId }: { conversationId: string }) => {
      try {
        const cid = new mongoose.Types.ObjectId(conversationId);
        await markRead(cid, me);
        wsServer.to(`conv:${cid.toString()}`).emit("chat:read", {
          conversationId,
          userId: me,
        });
      } catch {}
    });

    // ---- TYPING ----
    socket.on(
      "chat:typing",
      ({ conversationId, isTyping }: { conversationId: string; isTyping: boolean }) => {
        const room = `conv:${conversationId}`;
        socket.to(room).emit("chat:typing", {
          conversationId,
          userId: me,
          isTyping,
        });
      }
    );

    socket.on("disconnect", (reason) => {
      console.log("WS disconnect:", socket.id, "reason:", reason);
    });
  });

  httpServer.listen(socketPort, () => console.log(`Websocket run on ${socketPort} port`));
};

export default startWsServer;