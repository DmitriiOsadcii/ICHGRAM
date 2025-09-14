import multer, { StorageEngine, Options, FileFilterCallback } from "multer";
import path from "node:path";
import fs from "node:fs";
import { Request } from "express";
import HttpExeption from "../utils/HttpExeption";

const TMP_DIR = path.resolve("temp");
fs.mkdirSync(TMP_DIR, { recursive: true });

const storage: StorageEngine = multer.diskStorage({
  destination: TMP_DIR,
  filename: (_req, file, cb): void => {
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${unique}${ext}`);
  },
});


const limits: Options["limits"] = {
  fileSize: 10 * 1024 * 1024, // 5MB для фото; увеличь при необходимости
};

const ALLOWED_EXTS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif", // базовые
  // опционально для айфонов:
  // ".heic", ".heif",
]);

const ALLOWED_MIMES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif",
  // "image/heic", "image/heif",
]);

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIMES.has(file.mimetype);
  const extOk = ALLOWED_EXTS.has(ext);

  if (!mimeOk || !extOk) {
    return cb(
      HttpExeption(
        400,
        `Only images are allowed: ${[...ALLOWED_EXTS].join(", ")} up to ${Math.round(limits.fileSize! / 1024 / 1024)}MB`
      )
    );
  }
  cb(null, true);
};


const uploadImage = multer({ storage, limits, fileFilter });
export default uploadImage;