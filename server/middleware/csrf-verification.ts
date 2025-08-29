import e from "express";
import { isValidOrigin } from "../utils/origins";
import config from "../utils/config";

function originMatchRequestHost(req: e.Request) {
  return (
    `${req.protocol}://${req.host}` === config.baseUrl?.replace(/\/+$/, "")
  );
}

function csrfVerification(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction
) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();

  const origin = req.get("origin") || "";
  const referer = req.get("referer") || "";

  const validOrigin = isValidOrigin(origin);
  const validReferer = isValidOrigin(referer);

  const sameHost =
    originMatchRequestHost(req) ||
    (config.nodeENV === "development" && req.hostname === "localhost");

  if (!(validOrigin || validReferer || sameHost))
    return res
      .status(403)
      .json({ error: "CSRF Verification Failed - Bad origin" });

  return next();
}

export default csrfVerification;
