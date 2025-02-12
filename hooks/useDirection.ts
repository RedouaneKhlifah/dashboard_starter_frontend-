// hooks/useDirection.ts
import { useState, useEffect } from "react";

type Direction = "ltr" | "rtl";

export const useDirection = (): Direction => {
  const [direction, setDirection] = useState<Direction>(() => {
    // Get initial direction from document element or default to ltr
    if (typeof document !== "undefined") {
      return (document.documentElement.getAttribute("dir") ||
        "ltr") as Direction;
    }
    return "ltr";
  });

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "dir") {
          const newDir = (document.documentElement.getAttribute("dir") ||
            "ltr") as Direction;
          setDirection(newDir);
        }
      });
    });

    // Observe changes to the html element's dir attribute
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    return () => observer.disconnect();
  }, []);

  return direction;
};
