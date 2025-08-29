import { Router } from "express";
import prisma from "../../database/prisma";

const router = Router();

router.get("/me", async (req, res) => {
  const user = req.user as { id: string } | undefined;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const userData = await prisma.user.findUnique({ where: { id: user.id } });
  if (!userData) return res.status(400).json({ error: "Invalid User" });

  return res.status(200).json({
    id: userData?.id,
    email: userData?.email,
    name: userData?.name,
    avatar: userData?.avatar,
  });
});

export default router;
