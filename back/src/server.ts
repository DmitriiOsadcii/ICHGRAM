
import 'dotenv/config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/errorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";

import authRouter from "./routers/auth.router";
import userRouter from "./routers/user.router";
import profileRouter from "./routers/profile.router";
import router from "./routers/googleAuth";
import postsRouter from "./routers/posts.router";
import followRouter from "./routers/follow.router";
import commentsRouter from "./routers/comments.router";
import likesRouter from "./routers/likes.router";
import notificationsRouter from "./routers/notifications.router";
import chatsRouter from "./routers/chats.router";





// ... импорты роутов, error/notFound

const startServer = () => {
  const app = express();

  // ✅ CORS. Никаких app.options("*", ...) в Express 5!
  const ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];
  app.use(
    cors({
      origin: ALLOWED_ORIGINS,
      credentials: false, // мы работаем по Bearer-токену, без cookies
      // НЕ указывай allowedHeaders — cors сам отзеркалит из preflight
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  // Временный healthcheck, чтобы проверить доступность
  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // ✅ Роуты
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/profile", profileRouter);
  app.use("/auth", router);
  app.use("/api/posts", postsRouter);
  app.use("/api/follow", followRouter);
  app.use("/api/comments", commentsRouter);
  app.use("/api/likes", likesRouter);
  app.use("/api/notifications", notificationsRouter);
  app.use("/api/chats", chatsRouter);

  // ✅ Хэндлеры ошибок — последними
  app.use(notFoundHandler);
  app.use(errorHandler);

  // ❗ Исправь порт
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, () => console.log(`Server is running on ${PORT} port`));
};

export default startServer;