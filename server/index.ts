import app from "./utils/app";
import config from "./utils/config";

app.listen(config.port, (error) => {
  if (error) return console.log("Error starting the server...", error);
  else console.log(`Listening to port ${config.port}...`);
});
