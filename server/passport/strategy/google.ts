import { Strategy, StrategyOptions } from "passport-google-oauth20";
import config from "../../utils/config";
import verify from "../verify";

const options: StrategyOptions = {
  clientID: config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: `${config.baseUrl}/api/auth/callback/google`,
  scope: ["profile", "email"],
};

export default new Strategy(options, verify);
