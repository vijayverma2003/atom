import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./users";
import authMiddleware from "../middleware/auth";

const router = Router();

router.use("/auth", authRouter);
router.use(authMiddleware);

router.use("/users", userRouter);

export default router;
