import cookieParser from "cookie-parser";
import cors from "cors";
import { default as e, default as express } from "express";
import router from "../routes";
import { validOrigins } from "./origins";

const app = express();

app.set("trust proxy", 1);
const corsConfiguration = {
  origin: [...validOrigins],
  credentials: true,
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsConfiguration));
app.use(cookieParser());
app.use(express.json());

app.use("/api", router);

app.use((error: any, req: e.Request, res: e.Response, next: e.NextFunction) => {
  console.error(error);
  return res.status(500).json({ error: "Internal Server Error" });
});

export default app;
