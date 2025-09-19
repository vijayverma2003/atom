"use client";

import ToastContext from "@/context/ToastContext";
import { PropsWithChildren, useEffect, useState } from "react";

const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<
    { type: "success" | "error"; message: string }[]
  >([]);
  const [visible, setVisible] = useState(false);

  const addToast = (type: "success" | "error", message: string) => {
    setToasts((prev) => [...prev, { type, message }]);
    setVisible(true);
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const visibilityTimeout = setTimeout(() => {
        setVisible(false);
      }, 4000);

      const toastsTimeout = setTimeout(() => {
        setToasts((prev) => {
          if (prev.length > 1) setVisible(true);
          return prev.slice(1);
        });
      }, 5000);

      return () => {
        clearTimeout(visibilityTimeout);
        clearTimeout(toastsTimeout);
      };
    }
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      <div
        role="alert"
        aria-live="assertive"
        className={`absolute top-10 left-[50%] -translate-x-[50%] py-5 px-12 text-2xl rounded-full transition-opacity duration-500 ease-out z-100 ${
          visible ? "opacity-100" : "opacity-0"
        } ${
          toasts[0]?.type === "error"
            ? "bg-red-500/10 border border-red-500/30"
            : "bg-green-500/10 border-green-500/30"
        }`}
      >
        {toasts[0]?.message}
      </div>

      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
