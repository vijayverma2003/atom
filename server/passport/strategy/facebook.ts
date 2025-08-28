import { Strategy, StrategyOptions } from "passport-facebook";
import config from "../../utils/config";
import verify from "../verify";

const configuration: StrategyOptions = {
  clientID: config.facebookAppId,
  clientSecret: config.facebookAppSecret,
  callbackURL: `${config.baseUrl}/api/auth/callback/facebook`,
  scope: ["email", "public_profile"],
  profileFields: ["id", "displayName", "photos", "email", "name"],
};

export default new Strategy(configuration, verify);
