import { CookieOptions } from "express";
import config from "./config";

export const LOGIN_ORIGIN_COOKIE = "loginOrigin";
export const TOKEN_COOKIE = "token";

export const loginOriginCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.nodeENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 5, // 5 minutes
  path: "/",
};

export const tokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: config.nodeENV === "production",
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
  path: "/",
};

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWV4cnh3bGcwMDAwcnhic2t6cXZjbjdwIiwiaWF0IjoxNzU2NjE1NDk4LCJleHAiOjE3NTY2MTYzOTh9.JfuYW-ie_mqbfOY7w6WLX92ivvRY4THE6zXYnD3g-4I
