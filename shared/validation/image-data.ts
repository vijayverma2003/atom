import z from "zod";

const imageFileSchema = z.object({
  type: z.enum([
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/jpg",
  ]),
  filename: z
    .string()
    .min(1, "Filename is required")
    .max(255, "Filename must be less than 256 characters"),
  size: z
    .number()
    .positive("Size must be a positive number")
    .max(10_000_000, "Size must be less than 10MB"),
});

export default imageFileSchema;
