import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./users";
import authMiddleware from "../middleware/auth";
import csrfVerification from "../middleware/csrf-verification";
import imageRouter from "./images";

const router = Router();

router.use(csrfVerification);
router.use("/auth", authRouter);

router.use(authMiddleware);
router.use("/users", userRouter);
router.use("/images", imageRouter);

export default router;
