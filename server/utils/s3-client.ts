import { S3Client } from "@aws-sdk/client-s3";
import config from "./config";

const S3 = new S3Client({
  region: "auto",
  endpoint: config.cloudflareAccessEndpoint,
  credentials: {
    accessKeyId: config.cloudflareAccessKeyId,
    secretAccessKey: config.cloudflareSecretAccessKey,
  },
});

export default S3;
