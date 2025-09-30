import { Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import prisma from "../../database/prisma";
import config from "../utils/config";
import * as cookies from "../utils/cookies";
import { isValidOrigin, toOrigin } from "../utils/origins";
import { issueToken } from "../utils/tokens";
import google from "../passport/strategy/google";
import facebook from "../passport/strategy/facebook";

const router = Router();

export const callbackConfiguration = {
  failureRedirect: "/login",
  failureMessage: true,
  session: false,
};

passport.use("google", google);
passport.use("facebook", facebook);

router.get("/login/:provider", (req, res, next) => {
  const provider = req.params.provider;

  const validProviders = ["google", "facebook"];

  if (!validProviders.includes(provider))
    return res.status(400).json({ error: "Invalid provider" });

  const redirectURL = req.query.redirectURL || undefined;
  if (!redirectURL)
    return res
      .status(400)
      .json({ error: "The redirect URL query parameter is required" });

  const redirectOrigin = toOrigin(redirectURL as string);

  if (!isValidOrigin(redirectOrigin))
    return res.status(400).json({ error: "Invalid redirect URL" });

  res.cookie(
    cookies.LOGIN_ORIGIN_COOKIE,
    redirectURL,
    cookies.loginOriginCookieOptions
  );

  return passport.authenticate(provider, { session: false })(req, res, next);
});

router.get(
  "/callback/google",
  passport.authenticate("google", callbackConfiguration),
  (req, res, next) => next()
);

router.get(
  "/callback/facebook",
  passport.authenticate("facebook", callbackConfiguration),
  (req, res, next) => next()
);

router.use("/callback/:path", async (req, res, next) => {
  try {
    if (!req.user) return res.redirect("/login");

    const user = req.user as { id: string };
    const token = issueToken(user.id);
    const redirectURL = req.cookies?.[cookies.LOGIN_ORIGIN_COOKIE];
    const origin = toOrigin(redirectURL);
    const path = isValidOrigin(origin) ? redirectURL : "/";

    res.clearCookie(cookies.LOGIN_ORIGIN_COOKIE, {
      path: cookies.loginOriginCookieOptions.path,
    });

    res.cookie(cookies.TOKEN_COOKIE, token, cookies.tokenCookieOptions);

    return res.status(302).redirect(path);
  } catch (error) {
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const oldToken = req.cookies[cookies.TOKEN_COOKIE];
    if (!oldToken) return res.status(401).json({ error: "No token found" });

    const decoded = jwt.decode(oldToken) as { iat: number };
    if (!decoded || !decoded.iat)
      return res.status(401).json({ error: "Invalid token" });

    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24 * 7)
      return res
        .status(401)
        .json({ error: "Max age exceeded for refreshing the token" });

    let payload = jwt.verify(oldToken, config.jwtSecretKey, {
      ignoreExpiration: true,
    }) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user)
      return res
        .status(401)
        .json({ error: "Invalid token, could not find the user" });

    const newToken = issueToken(user.id);

    res.clearCookie(cookies.TOKEN_COOKIE, cookies.tokenCookieOptions);
    res.cookie(cookies.TOKEN_COOKIE, newToken, cookies.tokenCookieOptions);

    return res.status(200).json({});
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res, next) => {
  try {
    res.clearCookie(cookies.TOKEN_COOKIE, cookies.tokenCookieOptions);
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
});

export default router;
