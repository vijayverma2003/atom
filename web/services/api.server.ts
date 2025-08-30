import axios, { AxiosError, AxiosResponse } from "axios";
import { cookies } from "next/headers";

const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;

const base = axios.create({
  baseURL,
  withCredentials: true,
});

let tokenPromise: Promise<AxiosResponse> | null = null;

base.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!tokenPromise)
        tokenPromise = axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

      try {
        const response = await tokenPromise;
        console.log(response);
        return base(originalRequest);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(
            "Refresh failed:",
            error?.response?.status,
            error?.response?.data,
            error?.config?.headers
          );
          console.log(error.response?.data.error);
        }
        return Promise.reject(error);
      } finally {
        tokenPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

export async function serverAPI() {
  const cookieStore = await cookies();
  console.log(cookieStore);

  const api = base.create({
    baseURL,
    withCredentials: true,
    headers: {
      cookie: cookieStore.toString() || "",
    },
  });

  return api;
}

export default serverAPI;
