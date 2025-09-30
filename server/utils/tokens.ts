import jwt from "jsonwebtoken";
import config from "./config";

export function issueToken(userId: string, iat?: number) {
  return jwt.sign(iat ? { userId, iat } : { userId }, config.jwtSecretKey, {
    expiresIn: "15m",
  });
}
