"use client";

import AuthContext from "@/context/AuthContext";
import api from "@/services/api.client";
import { AxiosError, AxiosResponse } from "axios";
import {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserWithoutSensitiveInfo } from "../../types/users";
import ToastContext from "@/context/ToastContext";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const RECENT_MS = 30_000; // 30 seconds

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserWithoutSensitiveInfo | null>(null);
  const { addToast } = useContext(ToastContext);

  // Todo
  // Return expiresIn from the server side to not add a magic interval

  const refreshingRef = useRef<Promise<AxiosResponse<any, any>> | null>(null);

  const fetchUser = async () => {
    try {
      const { data } = await api.get<UserWithoutSensitiveInfo>("/users/me");
      setUser(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        addToast(
          "error",
          error.response?.data.message || "Error fetching user data"
        );
      } else addToast("error", "Error fetching user data");
    }
  };

  const storeLastRefreshAt = () => {
    localStorage.setItem("auth:lastRefreshAt", Date.now().toString());
  };

  const refreshedRecently = () => {
    const timestamp = Number(localStorage.getItem("auth:lastRefreshAt") || "");
    return Number.isFinite(timestamp) && Date.now() - timestamp < RECENT_MS;
  };

  const refreshToken = async () => {
    try {
      if (refreshedRecently()) {
        if (!user) fetchUser();
        return;
      }

      if (!refreshingRef.current) {
        refreshingRef.current = api.post("/auth/refresh-token");
        if (refreshedRecently()) {
          refreshingRef.current = null;
          return;
        }
      }
      await refreshingRef.current;

      storeLastRefreshAt();

      if (!user) fetchUser();
    } catch (error) {
      addToast("error", "Failed to refresh token");
    } finally {
      refreshingRef.current = null;
    }
  };

  const onWake = () => {
    if (document.visibilityState === "hidden") return;

    const lastRefreshAt = Number(
      localStorage.getItem("auth:lastRefreshAt") || ""
    );

    if (
      Number.isFinite(lastRefreshAt) &&
      Date.now() - lastRefreshAt > RECENT_MS
    )
      refreshToken();
  };

  useEffect(() => {
    refreshToken();

    window.addEventListener("focus", onWake);
    document.addEventListener("visibilitychange", onWake);

    const interval = setInterval(() => {
      refreshToken();
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.removeEventListener("focus", onWake);
      document.removeEventListener("visibilitychange", onWake);
      clearInterval(interval);
    };
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
