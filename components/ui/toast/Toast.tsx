"use client";
import { useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { CSSTransition } from "react-transition-group";
import { Toast, ToastPosition } from "./types";
import { cn } from "@/lib/utils";
import "./toast.css";

export const ToastComponent = ({
  id,
  message,
  title,
  type,
  duration = 5000,
  removeToast,
  position
}: Toast & { removeToast: (id: string) => void; position: ToastPosition }) => {
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (duration === 0 || isHovered) return;

    const totalTime = duration;
    const interval = 50;
    const steps = totalTime / interval;
    const decrement = 100 / steps;
    console.log(" 9lawi context");
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(prev - decrement, 0));
    }, interval);

    return () => clearInterval(timer);
  }, [duration, isHovered]);

  useEffect(() => {
    if (progress <= 0) {
      removeToast(id);
    }
  }, [progress, id, removeToast]);

  const getIcon = () => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "success":
        return <CheckCircle2 className={iconClass} />;
      case "error":
        return <AlertCircle className={iconClass} />;
      case "warning":
        return <AlertTriangle className={iconClass} />;
      case "info":
        return <Info className={iconClass} />;
    }
  };

  return (
    <CSSTransition
      timeout={300}
      classNames="toast"
      unmountOnExit
    >
      <div
        role="alert"
        aria-live="polite"
        className={cn(
          "relative w-72 rounded-lg p-4 shadow-lg transition-transform",
          "bg-background border border-border",
          "hover:scale-[1.02] hover:shadow-md"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "shrink-0",
            type === "success" && "text-success",
            type === "error" && "text-destructive",
            type === "warning" && "text-warning",
            type === "info" && "text-info"
          )}>
            {getIcon()}
          </div>
          
          <div className="flex-1">
            {title && <h3 className="font-medium text-sm mb-1">{title}</h3>}
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>

          <button
            onClick={() => removeToast(id)}
            className="p-1 -mt-1 -mr-1 hover:bg-muted/50 rounded-full"
            aria-label="Close toast"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/20 rounded-b-lg">
            <div
              className={cn(
                "h-full transition-all duration-300 rounded-b-lg",
                type === "success" && "bg-success",
                type === "error" && "bg-destructive",
                type === "warning" && "bg-warning",
                type === "info" && "bg-info"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </CSSTransition>
  );
};