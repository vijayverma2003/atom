import e from "express";
import jwt from "jsonwebtoken";
import prisma from "../../database/prisma";
import { TOKEN_COOKIE } from "../utils/cookies";
import config from "../utils/config";

export default async function auth(
  req: e.Request,
  res: e.Response,
  next: e.NextFunction
) {
  try {
    const token = req.cookies[TOKEN_COOKIE];

    if (!token)
      return res.status(401).json({ error: "Missing authorization token" });

    const payload = jwt.verify(token, config.jwtSecretKey, {
      clockTolerance: 5,
    }) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = user;

    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    }

    next(error);
  }
}
