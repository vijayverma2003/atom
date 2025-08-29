import { Router } from "express";
import authRouter from "./auth";
import authMiddleware from "../middleware/auth";

const router = Router();

router.use("/auth", authRouter);
router.use(authMiddleware);

export default router;
