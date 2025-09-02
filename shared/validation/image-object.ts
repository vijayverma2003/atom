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
