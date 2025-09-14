import 'dotenv/config';
import { Router } from "express";
import { google } from "googleapis";

const router = Router();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
  console.error('[ENV] Missing GOOGLE_* variables');
}

const oauth2 = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

// 1) ЛОГИРУЕМ auth URL и проверяем redirect_uri глазами
router.get("/google/url", (req, res) => {
  const url = oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
    redirect_uri: process.env.GOOGLE_REDIRECT_URI, // http://localhost:5173/
  });
  console.log("AUTH URL:", url); // Проверь глазами redirect_uri в ссылке
  res.json({ url });
});

router.post("/google/exchange", async (req, res) => {
  const { code } = req.body;
  try {
    const { tokens } = await oauth2.getToken({
      code,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI, // тот же самый!
    });
    console.log("TOKENS:", tokens);
    res.json(tokens);
  } catch (e: any) {
    console.error("EXCHANGE ERROR:", e.response?.data || e.message);
    res.status(400).json({ error: e.message, details: e.response?.data });
  }
});

export default router;