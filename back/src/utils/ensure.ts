import mongoose from "mongoose";

import type { RequestHandler } from "express";
export const ensureObjectIdParam: RequestHandler = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid id format" });
  }
  next();
};