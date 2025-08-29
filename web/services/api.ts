import axios, { AxiosError, AxiosResponse } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let csrfToken: string | null = null;
let csrfTokenPromise: Promise<AxiosResponse<{ csrfToken: string }>> | null =
  null;

api.interceptors.request.use(async (config) => {
  if (!csrfToken) {
    if (!csrfTokenPromise)
      csrfTokenPromise = axios.get<{ csrfToken: string }>(
        `${baseURL}/auth/csrf-token`,
        { withCredentials: true }
      );

    try {
      const response = await csrfTokenPromise;
      csrfToken = response.data.csrfToken;
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      throw new Error("CSRF token retrieval failed");
    } finally {
      csrfTokenPromise = null;
    }
  }

  const csrfMethods = ["post", "put", "delete", "patch"];
  if (config.method && csrfMethods.includes(config.method.toLowerCase()))
    config.headers["X-CSRF-Token"] = csrfToken;

  console.log(
    csrfToken,
    config.method && csrfMethods.includes(config.method.toLowerCase())
  );
  return config;
});

let tokenPromise: Promise<AxiosResponse> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!tokenPromise)
        tokenPromise = axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true, headers: { "X-CSRF-Token": csrfToken } }
        );

      try {
        const response = await tokenPromise;
        console.log(response);
        return api(originalRequest);
      } catch (error) {
        if (error instanceof AxiosError)
          console.log(
            "Refresh failed:",
            error?.response?.status,
            error?.response?.data,
            error?.config?.headers
          );
        return Promise.reject(error);
      } finally {
        tokenPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
