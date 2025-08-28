import jwt from "jsonwebtoken";
import config from "./config";

export function issueToken(userId: string) {
  return jwt.sign({ userId }, config.jwtSecretKey, { expiresIn: "15m" });
}
