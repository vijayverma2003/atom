"use client";

import ToastContext from "@/context/ToastContext";
import api from "@/services/api.client";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const LogoutButton = () => {
  const { addToast } = useContext(ToastContext);
  const router = useRouter();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      addToast("success", "Logged out successfully");
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        addToast(
          "error",
          error.response?.data.message || "An error occured while logging out"
        );
      } else addToast("error", "An error occured while logging out");
    }
  };

  return (
    <button
      onClick={logout}
      className="btn btn-ghost whitespace-nowrap text-lg w-full"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
