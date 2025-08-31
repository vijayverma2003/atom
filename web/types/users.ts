import { User } from "../../database/generated/prisma";

export type UserWithoutSensitiveInfo = Pick<
  User,
  "id" | "email" | "name" | "avatar"
>;
