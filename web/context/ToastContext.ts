import { createContext } from "react";

interface ToastContextType {
  toasts: { type: "success" | "error"; message: string }[];
  addToast: (type: "success" | "error", message: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
});

export default ToastContext;
