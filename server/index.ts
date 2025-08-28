import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import router from "./routes";
import config from "./utils/config";
import { validOrigins } from "./utils/origins";

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

app.listen(port, (error) => {
  if (error) return console.log("Error starting the server...", error);
  else console.log(`Listening to port ${port}...`);
});
