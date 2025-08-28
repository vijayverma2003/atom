import e from "express";
import config from "../utils/config";
import crypto from "crypto";
import { isValidOrigin } from "../utils/origins";
import { CSRF_COOKIE } from "../utils/cookies";

function originMatchRequestHost(req: e.Request) {
  return (
    `${req.protocol}://${req.host}` === config.baseUrl?.replace(/\/+$/, "")
  );
}

function safeEqual(a?: string, b?: string) {
  if (!a || !b) return false;

  const c = Buffer.from(a);
  const d = Buffer.from(b);

  if (c.length !== d.length) return false;

  return crypto.timingSafeEqual(c, d);
}

function requireCSRF(req: e.Request, res: e.Response, next: e.NextFunction) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();

  const origin = req.get("origin") || "";
  const referer = req.get("referer") || "";

  const validOrigin = isValidOrigin(origin);
  const validReferer = isValidOrigin(referer);

  const sameHost =
    originMatchRequestHost(req) ||
    (config.nodeENV === "development" && req.hostname === "localhost");

  if (!(validOrigin || validReferer || sameHost))
    return res.status(403).json({ error: "Bad origin" });

  const headerToken = req.get("x-csrf-token");
  const cookieToken = req.cookies?.[CSRF_COOKIE];

  if (!safeEqual(headerToken, cookieToken))
    return res.status(403).json({ error: "CSRF validation failed" });

  const contentType = req.headers["content-type"] || "";

  if (contentType && contentType.split(";")[0].trim() !== "application/json")
    return res.status(415).json({ error: "Unsupported Media Type" });

  return next();
}

export default requireCSRF;
