import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import router from "./routes";
import config from "./utils/config";
import { validOrigins } from "./utils/origins";
import e from "express";

const app = express();
const port = config.port || 3001;

const corsConfiguration = {
  origin: [...validOrigins],
  credentials: true,
  allowedHeaders: ["Content-Type", "X-CSRF-Token"],
};

app.use(cors(corsConfiguration));
app.use(cookieParser());
app.use("/api", router);

app.use((error: any, req: e.Request, res: e.Response, next: e.NextFunction) => {
  console.error(error);
  return res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, (error) => {
  if (error) return console.log("Error starting the server...", error);
  else console.log(`Listening to port ${port}...`);
});
