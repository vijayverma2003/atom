import { AxiosError } from "axios";
import { User } from "../../database/generated/prisma";
import serverAPI from "./api.server";

type ClientUser = Pick<User, "id" | "email" | "name" | "avatar">;

export async function getClientUser() {
  try {
    const api = await serverAPI();
    const response = await api.get<ClientUser>("/users/me");
    return { user: response.data, error: null };
  } catch (error) {
    if (error instanceof AxiosError) {
      return { user: null, error: error.response?.data.message };
    } else return { user: null, error: null };
  }
}
