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
import useDebounce from "@/hooks/useDebounce";
import clsx from "clsx";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDirection } from "@/hooks/useDirection";

export type AutoCompleteSearchResult = {
  id: number;
  title: string;
};

interface SearchComponentProps<T extends AutoCompleteSearchResult> {
  id: string;
  label?: string;
  onSearch: (query: string) => Promise<T[]>;
  value?: string;
  onChange?: (value: number | null) => void;
  placeholder?: string;
  minChars?: number;
  debounceMs?: number;
  required?: boolean;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
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
  value = "",
  onChange,
  placeholder = "Search...",
  minChars = 2,
  debounceMs = 300,
  required = false,
  error,
  className = "",
  icon,
  prefix,
}: SearchComponentProps<T>) => {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const direction = useDirection();

  const isRTL = useMemo(() => direction === "rtl", [direction]);

  const hasQuery = query.length >= minChars;
  const showNoResults = showResults && !isLoading && results.length === 0;
  const showLoading = isLoading && hasQuery;

  const clearSearch = useCallback(() => {
    setQuery("");
    onChange?.(null);
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, [onChange]);

  const handleResultSelection = useCallback(
    (result: T) => {
      setQuery(result.title);
      onChange?.(result.id);
      setShowResults(false);
      setSelectedIndex(-1);
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
        setResults([]);
        setShowResults(false);
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [hasQuery, onSearch]
  );

  const debouncedSearch = useDebounce(performSearch, debounceMs);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (newValue === query) return;

      setQuery(newValue);
      setSelectedIndex(-1);
      debouncedSearch(newValue);
    },
    [query, debouncedSearch]
  );

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

  // Sync with external value changes
  useEffect(() => {
    if (value !== query) {
      setQuery(value);
    }
  }, [value]);

  const inputClasses = clsx(
    "w-full h-11 bg-background border-2 rounded-md",
    "focus:outline-none focus:ring-2 focus:ring-primary/30",
    "transition-colors duration-200",
    error ? "border-red-500" : "border-input hover:border-primary/50",
    isRTL ? "pr-11 pl-11" : "pl-11 pr-11"
  );

  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-2"
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
                isRTL ? "right-3" : "left-3"
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
            placeholder={placeholder}
            className={inputClasses}
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />

          <div
            className={clsx(
              "absolute top-0 bottom-0 flex items-center",
              isRTL ? "left-3" : "right-3"
            )}
          >
            {showLoading ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : query ? (
              <button
                onClick={clearSearch}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
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

        {showResults && (
          <div
            ref={resultsRef}
            className="absolute w-full mt-2 bg-background border border-input rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50"
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
