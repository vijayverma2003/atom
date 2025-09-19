import {
  DeleteObjectsCommand,
  PutObjectCommand,
  waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Router } from "express";
import crypto from "node:crypto";
import z from "zod";
import { Prisma } from "../../database/generated/prisma";
import prisma from "../../database/prisma";
import {
  imageObjectSchema,
  presignedUrlDataSchema,
} from "../../shared/validation/image-object";
import config from "../utils/config";
import S3 from "../utils/s3-client";

const router = Router();
const BUCKET_NAME = "image-sharing-app";

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
        Bucket: BUCKET_NAME,
        ContentType: type,
        ContentLength: size,
      }),
      {
        expiresIn: 30,
      }
    );

    return res.status(201).json({
      key,
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

    const posts = await prisma.post.findMany({
      where,
      include: { images: true },
    });

    res.status(200).json(posts);
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

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.user as { id: string };

    const post = await prisma.post.findUnique({
      where: { id, userId: user.id },
      include: { images: true },
    });

    if (!post) return res.status(401).json({ error: "Unauthorized" });

    let keys = post.images.map((image) => {
      if (!image.key) {
        const url = new URL(image.url);
        return decodeURIComponent(url.pathname.slice(1));
      } else return image.key;
    });

    await prisma.$transaction(async (tx) => {
      await tx.image.deleteMany({
        where: { postId: id },
      });
      await tx.post.delete({ where: { id } });
    });

    const command = new DeleteObjectsCommand({
      Bucket: BUCKET_NAME,
      Delete: { Objects: keys.map((key) => ({ Key: key })) },
    });

    await S3.send(command);

    for (const key in keys) {
      await waitUntilObjectNotExists(
        { client: S3, maxWaitTime: 30 },
        { Bucket: BUCKET_NAME, Key: key }
      );
    }

    res.status(200).json({});
  } catch (error) {
    next(error);
  }
});

export default router;
