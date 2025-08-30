import axios from "axios";
import { cookies } from "next/headers";

const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

async function serverAPI() {
  const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {},
  });

  api.interceptors.request.use(async (config) => {
    const cookieStore = await cookies();
    config.headers.cookie = cookieStore.toString() || "";
    return config;
  });

  return api;
}

export default serverAPI;
