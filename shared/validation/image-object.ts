import z from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/webp",
];

export const imageObjectSchema = z.object({
  title: z
    .string()
    .max(250, "Title is too long, it must be less than 250 characters"),
  description: z
    .string()
    .max(1000, "Description is too long, it must be less than 1000 characters"),
  images: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "File name is required")
          .max(250, "File name must be less than 250 characters"),
        size: z
          .number()
          .positive("Size must be a positive number")
          .max(10_000_000, "Size must be less than 10MB"),
        type: z.enum(ACCEPTED_IMAGE_TYPES),
        width: z.number().positive(),
        height: z.number().positive(),
        url: z.url(),
        hash: z
          .string()
          .max(1000, "Hash is too long, it must be less than 1000 characters"),
      })
    )
    .max(5, "Maximum of 5 images is allowed")
    .min(1, "At least one image is required"),
});

export const imageFormSchema = z.object({
  title: z
    .string()
    .max(250, "Title is too long, it must be less than 250 characters"),
  description: z
    .string()
    .max(1000, "Description is too long, it must be less than 1000 characters"),
  images: z
    .array(
      z
        .instanceof(File, { error: "An image file is required" })
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          `The image is too large. Please choose an image smaller than ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB.`
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Please upload a valid image file (JPEG, PNG, GIF or WebP)"
        )
    )
    .max(5, "Maximum of 5 images is allowed")
    .min(1, "At least one image is required"),
});

export type ImageObjectData = z.infer<typeof imageObjectSchema>;
export type ImageFormData = z.infer<typeof imageFormSchema>;

export const presignedUrlDataSchema = z.object({
  type: z.enum([
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/jpg",
  ]),
  name: z
    .string()
    .min(1, "File name is required")
    .max(250, "File name must be less than 250 characters"),
  size: z
    .number()
    .positive("Size must be a positive number")
    .max(10_000_000, "Size must be less than 10MB"),
  hash: z
    .string()
    .max(1000, "Hash is too long, it must be less than 1000 characters"),
});
