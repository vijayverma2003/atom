import { CookieOptions } from "express";
import config from "./config";

export const LOGIN_ORIGIN_COOKIE = "loginOrigin";
export const TOKEN_COOKIE = "token";

export const loginOriginCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.nodeENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 5, // 5 minutes
  path: "/api/auth",
};

export const tokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.nodeENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
  path: "/api",
};
