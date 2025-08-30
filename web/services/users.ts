import api, { serverAPI } from "./api.server";
import { User } from "../../database/generated/prisma";
import { AxiosError } from "axios";

type ClientUser = Pick<User, "id" | "email" | "name" | "avatar">;

export async function getClientUser() {
  try {
    const api = await serverAPI();
    const response = await api.get<ClientUser>("/users/me");
    return { user: response.data, error: null };
  } catch (error) {
    console.log("getClientUser", error);
    if (error instanceof AxiosError)
      return { user: null, error: error.message };
    else return { user: null, error: null };
  }
}
