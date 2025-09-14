import jwt from "jsonwebtoken";
import { UserDocument } from "../db/models/User";
import HttpExeption from "../utils/HttpExeption";
import { IJWTTokenPayload } from "../typescript/interfaces";

const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;

if (typeof JWT_SECRET !== "string" || !JWT_SECRET.length) {
  throw HttpExeption(500, "JWT_SECRET variable is not found in env");
}
if (typeof JWT_REFRESH_SECRET !== "string" || !JWT_REFRESH_SECRET.length) {
  throw HttpExeption(500, "JWT_REFRESH_SECRET variable is not found in env");
}

export const createToken = (user: UserDocument): string => {
  const payload = { id: user.id.toString().trim() };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

export const refreshTokens = (user: UserDocument): string => {
  const payload = { id: user.id.toString().trim() };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): string => {
  const { id } = jwt.verify(token, JWT_SECRET) as IJWTTokenPayload;
  return id;
};

export const verifyRefreshToken = (token: string): string => {
  const { id } = jwt.verify(token, JWT_REFRESH_SECRET) as IJWTTokenPayload;
  return id;
};

/*
JWT_SECRET=7U07M6NqePGrf0d3zFTOyAKSUwqb4mJA
JWT_REFRESH_SECRET=K9fP3xYq7bV2sLw1nR6oUzHtJgC4dAe
*/