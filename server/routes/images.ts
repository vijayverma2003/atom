import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Router } from "express";
import crypto from "node:crypto";
import z from "zod";
import {
  presignedUrlDataSchema,
  imageObjectSchema,
} from "../../shared/validation/image-object";
import config from "../utils/config";
import S3 from "../utils/s3-client";
import prisma from "../../database/prisma";
import { Prisma } from "../../database/generated/prisma";

const router = Router();

router.post("/create", async (req, res, next) => {
  try {
    const body = req.body;
    const validation = imageObjectSchema.safeParse(body);

    if (!validation.success)
      return res.status(400).json({
        error: z.treeifyError(validation.error),
      });

    const user = req.user as { id: string };
    const { title, description, images } = validation.data;

    console.log(user, images);

    const storedImages = await prisma.image.findMany({
      where: { hash: { in: images.map((image) => image.hash) } },
    });

    const generatedHashes = storedImages.map((image) => image.hash);

    const object = await prisma.post.create({
      data: {
        title,
        description,
        images: {
          create: images.filter(
            (image) => !generatedHashes.includes(image.hash)
          ),
          connect: storedImages.map((image) => ({ id: image.id })),
        },
        userId: user.id,
      },
      include: { images: true },
    });

    res.status(201).json(object);
  } catch (error) {
    next(error);
  }
});

router.post("/get-presigned-url", async (req, res, next) => {
  try {
    const body = req.body;
    console.log(body);
    const validation = presignedUrlDataSchema.safeParse(body);

    if (!validation.success)
      return res.status(400).json({
        error: z.treeifyError(validation.error),
      });

    const { name, type, size, hash } = validation.data;

    const image = await prisma.image.findUnique({ where: { hash } });
    if (image) return res.status(200).json({ imageUrl: image.url });

    const extension = name.split(".").pop();
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

    return res.status(201).json({
      imageUrl,
      signedUrl,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const userId = req.query.userId;

    const where = (userId ? { userId } : undefined) as Prisma.PostWhereInput;

    const objects = await prisma.post.findMany({
      where,
      include: { images: true },
    });

    res.status(200).json(objects);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const post = await prisma.post.findUnique({
      where: { id },
      include: { images: true },
    });

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

export default router;
