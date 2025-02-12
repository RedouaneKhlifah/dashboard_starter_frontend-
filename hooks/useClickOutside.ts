// hooks/useClickOutside.ts
import { RefObject, useEffect } from "react";

type ClickOutsideHandler = (event: MouseEvent) => void;

export const useClickOutside = <T extends HTMLElement>(
  refs: RefObject<T>[],
  callback: ClickOutsideHandler
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = refs.every((ref) => {
        const element = ref?.current;
        return element && !element.contains(event.target as Node);
      });

      if (isOutside) {
        callback(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
};
