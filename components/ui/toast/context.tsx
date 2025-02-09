"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastContextType, ToastPosition } from "./types";
import { ToastComponent } from "./Toast";
import { TransitionGroup } from "react-transition-group";
import { cn } from "@/lib/utils";

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export function ToastProvider({ 
  children,
  position = "top-right"
}: { 
  children: React.ReactNode;
  position?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [{ ...toast, id }, ...prev]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <TransitionGroup
        className={cn(
          "fixed z-[9999] space-y-2 p-4",
          position === "top-left" && "top-4 left-4",
          position === "top-right" && "top-4 right-4",
          position === "bottom-left" && "bottom-4 left-4",
          position === "bottom-right" && "bottom-4 right-4"
        )}
      >
        {toasts.map((toast) => (
          <ToastComponent
            key={toast.id}
            {...toast}
            removeToast={removeToast}
            position={position}
          />
        ))}
      </TransitionGroup>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};