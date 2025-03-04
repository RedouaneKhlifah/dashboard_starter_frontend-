"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
  useMemo,
} from "react";
import { Search, X, Loader2, AlertCircle } from "lucide-react";
import clsx from "clsx";
import useDebounce from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDirection } from "@/hooks/useDirection";
import { TicketRelationShipData } from "@/dto/ticket/ticketForm";

export type AutoCompleteSearchResult = {
  id: number;
  title: string;
};

interface SearchComponentProps<T extends AutoCompleteSearchResult> {
  id: string;
  label?: string;
  onSearch: (query: string) => Promise<T[]>;
  value?: { id: number; title: string } | null;
  onChange?: (value: TicketRelationShipData | null) => void;
  placeholder?: string;
  minChars?: number;
  debounceMs?: number;
  required?: boolean;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  disabled?: boolean;
  dropdownPosition?: "above" | "below"; // New prop
}

const KEYS = {
  ARROW_DOWN: "ArrowDown",
  ARROW_UP: "ArrowUp",
  ENTER: "Enter",
  ESCAPE: "Escape",
} as const;

const SearchComponent = <T extends AutoCompleteSearchResult>({
  id,
  label,
  onSearch,
  value = null,
  onChange,
  placeholder = "Search...",
  minChars = 2,
  debounceMs = 300,
  required = false,
  error,
  className = "",
  icon,
  prefix,
  disabled = false,
  dropdownPosition = "below", // Default value
}: SearchComponentProps<T>) => {
  const [query, setQuery] = useState(value?.title || "");
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const direction = useDirection();
  const isRTL = useMemo(() => direction === "rtl", [direction]);
  const hasQuery = query.length >= minChars;
  const showNoResults = showResults && !isLoading && results.length === 0;
  const showLoading = isLoading && hasQuery;

  const clearSearch = useCallback(
    (e?: React.MouseEvent) => {
      // Prevent form submission
      e?.preventDefault();

      if (disabled) return;
      setQuery("");
      onChange?.(null);
      setResults([]);
      setShowResults(false);
      setSelectedIndex(-1);
      setIsDirty(false);
      inputRef.current?.focus();
    },
    [disabled, onChange]
  );

  const handleResultSelection = useCallback(
    (result: T) => {
      setQuery(result.title);
      onChange?.(result);
      setShowResults(false);
      setSelectedIndex(-1);
      setIsDirty(false);
    },
    [onChange]
  );

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!hasQuery) {
        setResults([]);
        setShowResults(false);
        return;
      }
      try {
        setIsLoading(true);
        const searchResults = await onSearch(searchQuery);
        setResults((prev) =>
          JSON.stringify(prev) === JSON.stringify(searchResults)
            ? prev
            : searchResults
        );
        setShowResults(true);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
        setShowResults(false);
      } finally {
        setIsLoading(false);
      }
    },
    [hasQuery, onSearch]
  );

  const debouncedSearch = useDebounce(performSearch, debounceMs);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const newValue = e.target.value;
      if (newValue === query) return;

      setIsDirty(true);
      setQuery(newValue);
      setSelectedIndex(-1);
      debouncedSearch(newValue);

      if (value && newValue !== value.title) {
        setQuery(newValue);
        onChange?.(null);
      }
    },
    [disabled, query, debouncedSearch, value, onChange]
  );

  const hanldePast = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newValue = e.clipboardData.getData("text/plain");
    console.log("newValue", newValue);
    setIsDirty(true);
    setQuery(newValue);
    setSelectedIndex(-1);
    debouncedSearch(newValue);
  };

  const handleKeyNavigation = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case KEYS.ARROW_DOWN:
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case KEYS.ARROW_UP:
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case KEYS.ENTER:
          if (selectedIndex >= 0) {
            handleResultSelection(results[selectedIndex]);
          }
          break;
        case KEYS.ESCAPE:
          setShowResults(false);
          break;
      }
    },
    [handleResultSelection, results, selectedIndex]
  );

  useClickOutside([inputRef, resultsRef], () => setShowResults(false));

  useEffect(() => {
    if (!isDirty && value?.title !== query) {
      setQuery(value?.title || "");
    }
  }, [value, query, isDirty]);

  const handleBlur = useCallback(() => {
    if (!value) {
      setQuery("");
    }
  }, [value]);

  const inputClasses = clsx(
    "w-full h-11 bg-background border-2 rounded-md",
    "transition-colors duration-200",
    {
      "border-red-500": error,
      "border-input hover:border-primary/50": !error && !disabled,
      "cursor-not-allowed bg-muted border-input": disabled,
      // Remove focus styles when disabled
      "focus:outline-none focus:ring-2 focus:ring-primary/30": !disabled,
    },
    isRTL ? "pr-11 pl-11" : "pl-11 pr-11"
  );

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            "block text-sm font-medium mb-2",
            disabled ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="relative group">
          {(icon || prefix) && (
            <div
              className={clsx(
                "absolute top-0 bottom-0 flex items-center",
                isRTL ? "right-3" : "left-3",
                disabled ? "opacity-50" : ""
              )}
            >
              {icon && <span className="text-muted-foreground">{icon}</span>}
              {prefix && (
                <span className="text-sm text-muted-foreground">{prefix}</span>
              )}
            </div>
          )}

          <input
            ref={inputRef}
            id={id}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyNavigation}
            onBlur={handleBlur}
            placeholder={placeholder}
            className={inputClasses}
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            disabled={disabled}
            onPaste={hanldePast}
          />

          <div
            className={clsx(
              "absolute top-0 bottom-0 flex items-center",
              isRTL ? "left-3" : "right-3"
            )}
          >
            {showLoading ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : query && !disabled ? (
              <button
                type="button"
                onClick={clearSearch}
                className={clsx(
                  "text-muted-foreground hover:text-foreground transition-colors",
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                )}
                aria-label="Clear search"
                disabled={disabled}
              >
                <X className="w-5 h-5" />
              </button>
            ) : null}
          </div>
        </div>

        {error && (
          <div
            id={`${id}-error`}
            className="mt-1 text-xs text-red-500 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {showResults && !disabled && (
          <div
            ref={resultsRef}
            className={clsx(
              "absolute w-full bg-background border border-input rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50",
              dropdownPosition === "above"
                ? "bottom-full mb-2"
                : "top-full mt-2" // Adjust positioning based on dropdownPosition
            )}
            role="listbox"
            id="search-results"
          >
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={clsx(
                      "cursor-pointer transition-colors duration-200 px-4 py-3",
                      index === selectedIndex
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                    )}
                    role="option"
                    aria-selected={index === selectedIndex}
                    onClick={() => handleResultSelection(result)}
                  >
                    <div className="font-medium text-foreground">
                      {result.title}
                    </div>
                  </div>
                ))}
              </div>
            ) : showNoResults ? (
              <div className="px-4 py-6 text-center text-muted-foreground flex flex-col items-center">
                <Search className="w-6 h-6 mb-2" />
                <p>No results found</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(SearchComponent) as typeof SearchComponent;
