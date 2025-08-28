import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Router } from "express";
import crypto from "node:crypto";
import z from "zod";
import imageDataSchema from "../../shared/validation/image-data";
import config from "../utils/config";
import S3 from "../utils/s3-client";

const router = Router();

router.post("/get-presigned-url", async (req, res, next) => {
  try {
    const body = req.body;
    const validation = imageDataSchema.safeParse(body);

    if (!validation.success)
      return res.status(400).json({
        error: z.treeifyError(validation.error).errors[0],
      });

    const { filename, type, size } = validation.data;

    const extension = filename.split(".").pop();
    const key = `images/${crypto.randomBytes(16).toString("hex")}.${extension}`;
    const imageUrl = config.cloudflarePublicDevelopmentUrl + key;

    const signedUrl = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Key: key,
        Bucket: "image-sharing-app",
        ContentType: type,
        ContentLength: size,
      }),
      {
        expiresIn: 30,
      }
    );

    return res.status(200).json({
      imageUrl,
      signedUrl,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
