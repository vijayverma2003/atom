"use client";

import api from "@/services/api.client";
import { AxiosResponse } from "axios";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

const REFRESH_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const RECENT_MS = 30_000; // 30 seconds

const AuthProvider = ({ children }: PropsWithChildren) => {
  // Todo
  // Return expiresIn from the server side to not add a magic interval

  const refreshingRef = useRef<Promise<AxiosResponse<any, any>> | null>(null);

  const storeLastRefreshAt = () => {
    localStorage.setItem("auth:lastRefreshAt", Date.now().toString());
  };

  const refreshedRecently = () => {
    const timestamp = Number(localStorage.getItem("auth:lastRefreshAt") || "");
    return Number.isFinite(timestamp) && Date.now() - timestamp < RECENT_MS;
  };

  const refreshToken = async () => {
    try {
      if (refreshedRecently()) return;

      if (!refreshingRef.current) {
        refreshingRef.current = api.post("/auth/refresh-token");
        if (refreshedRecently()) {
          refreshingRef.current = null;
          return;
        }
      }
      await refreshingRef.current;

      storeLastRefreshAt();
    } catch (error) {
      console.log("Refreshing Token Failed", error);
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
    console.log("AuthProvider mounted");

    refreshToken();

    window.addEventListener("focus", onWake);
    document.addEventListener("visibilitychange", onWake);

    const interval = setInterval(() => {
      refreshToken();
    }, REFRESH_INTERVAL_MS);

    return () => {
      console.log("AuthProvider unmounted");
      window.removeEventListener("focus", onWake);
      document.removeEventListener("visibilitychange", onWake);
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
};

export default AuthProvider;
