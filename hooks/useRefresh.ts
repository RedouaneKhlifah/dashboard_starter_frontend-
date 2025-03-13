import http from "@/lib/http";
import { useCallback, useRef } from "react";

interface HandleRefreshProps {
  searchQuery?: string;
  currentPage: number;
  setIsLoading: (loading: boolean) => void;
  entity: string;
  setRecords: (records: any[]) => void;
  setTotalRecords: (totalRecords: number) => void;
  lang?: "en" | "ar" | "fr";
}

const useRefresh = ({
  searchQuery,
  currentPage,
  setIsLoading,
  entity,
  setRecords,
  setTotalRecords,
  lang,
}: HandleRefreshProps) => {
  const prevSearchQueryRef = useRef<string>(searchQuery || "");
  const prevCurrentPageRef = useRef<number>(currentPage);
  const trimmedSearchQuery = (searchQuery || "").trim();

  const shouldRefresh =
    prevSearchQueryRef.current !== trimmedSearchQuery ||
    prevCurrentPageRef.current !== currentPage;

  return useCallback(
    async (force?: boolean): Promise<void> => {
      if (!shouldRefresh && !force) {
        return;
      }

      const currentPageToUse =
        prevSearchQueryRef.current !== trimmedSearchQuery ? 1 : currentPage;

      setIsLoading(true);

      try {
        const response = await http(
          `${
            process.env.NEXT_PUBLIC_API_BASE_PATH
          }/api/${entity}?search=${encodeURIComponent(
            searchQuery || ""
          )}&page=${currentPageToUse}`,
          {
            method: "GET",
            lang,
          }
        );

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const res = await response.json();
        let data = res.data;
        const totalRecords = res.total;
        if (entity == "transactions") {
          data = res.transactions.data;
        }
        setRecords(data);
        setTotalRecords(totalRecords);
        // Update both refs after successful request
        prevSearchQueryRef.current = trimmedSearchQuery;
        prevCurrentPageRef.current = currentPageToUse;
      } catch (error) {
        console.error("Error during search:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      shouldRefresh,
      trimmedSearchQuery,
      currentPage,
      setIsLoading,
      entity,
      searchQuery,
      lang,
      setRecords,
      setTotalRecords,
    ]
  );
};

export default useRefresh;
