import { useCallback } from "react";

export const useEntityUpdate = <T extends { id: number }>(
  setEntities: React.Dispatch<React.SetStateAction<T[]>>
) => {
  return useCallback(
    (action: "created" | "updated" | "deleted", entity: T) => {
      switch (action) {
        case "created":
          setEntities((prev) => [entity, ...prev]);
          break;
        case "updated":
          setEntities((prev) =>
            prev.map((e) => (e.id === entity.id ? entity : e))
          );
          break;
        case "deleted":
          setEntities((prev) => prev.filter((e) => e.id !== entity.id));
          break;
      }
    },
    [setEntities]
  );
};
