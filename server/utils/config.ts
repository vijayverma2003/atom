import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.join(__dirname, "../.env") });

export default {
  nodeENV: process.env.NODE_ENV,
  port: process.env.PORT || 3001,
  baseUrl: process.env.BASE_URL,
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  facebookAppId: process.env.FACEBOOK_APP_ID!,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET!,
  cloudflareTokenValue: process.env.CLOUDFLARE_TOKEN_VALUE!,
  cloudflareAccessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
  cloudflareSecretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  cloudflareAccessEndpoint: process.env.CLOUDFLARE_ACCESS_ENDPOINT!,
  cloudflarePublicDevelopmentUrl:
    process.env.CLOUDFLARE_PUBLIC_DEVELOPMENT_URL!,
  jwtSecretKey: process.env.JWT_SECRET_KEY!,
};
