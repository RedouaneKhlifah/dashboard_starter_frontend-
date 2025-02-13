"use client";

// ─────────────────────────────────────────────────────────────────────────────
// React & Third-Party Imports
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Custom Hooks & Utilities
// ─────────────────────────────────────────────────────────────────────────────
import useDebounce from "@/hooks/useDebounce";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDirection } from "@/hooks/useDirection";

// ─────────────────────────────────────────────────────────────────────────────
// Domain Types
// ─────────────────────────────────────────────────────────────────────────────
import { TicketRelationShipData } from "@/dto/ticket/ticketForm";

// ─────────────────────────────────────────────────────────────────────────────
// Type & Interface Definitions
// ─────────────────────────────────────────────────────────────────────────────
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
}

// ─────────────────────────────────────────────────────────────────────────────
// Key Constants for Keyboard Navigation
// ─────────────────────────────────────────────────────────────────────────────
const KEYS = {
  ARROW_DOWN: "ArrowDown",
  ARROW_UP: "ArrowUp",
  ENTER: "Enter",
  ESCAPE: "Escape",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SearchComponent: A reusable autocomplete search input component
// ─────────────────────────────────────────────────────────────────────────────
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
}: SearchComponentProps<T>) => {
  // ─────────────────────────────
  // Local State
  // ─────────────────────────────
  const [query, setQuery] = useState(value?.title || "");
  const [results, setResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const [isDirty, setIsDirty] = useState(false); // Tracks if input has been modified

  // ─────────────────────────────
  // Refs
  // ─────────────────────────────
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────
  // Derived Values
  // ─────────────────────────────
  const direction = useDirection();
  const isRTL = useMemo(() => direction === "rtl", [direction]);
  const hasQuery = query.length >= minChars;
  const showNoResults = showResults && !isLoading && results.length === 0;
  const showLoading = isLoading && hasQuery;

  // ─────────────────────────────
  // Helper Functions
  // ─────────────────────────────

  // Clears the search input and resets state.
  const clearSearch = useCallback(() => {
    setQuery("");
    onChange?.(null);
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    setIsDirty(false); // Reset dirty state on clear
    inputRef.current?.focus();
  }, [onChange]);

  // Handles the selection of a result.
  const handleResultSelection = useCallback(
    (result: T) => {
      setQuery(result.title);
      onChange?.(result);
      setShowResults(false);
      setSelectedIndex(-1);
      setIsDirty(false); // Reset dirty state on selection
    },
    [onChange]
  );

  // Performs the search based on the current query.
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
        // Update results only if different from previous results.
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

  // Debounce the search function.
  const debouncedSearch = useDebounce(performSearch, debounceMs);

  // Handles changes in the input field.
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (newValue === query) return;

      setIsDirty(true); // Mark as dirty when user types
      setQuery(newValue);
      setSelectedIndex(-1);
      debouncedSearch(newValue);

      // If the query no longer matches the externally provided value, clear it.
      if (value && newValue !== value.title) {
        setQuery("");
        onChange?.(null);
      }
    },
    [query, debouncedSearch, value, onChange]
  );

  // Handles keyboard navigation within the results list.
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

  // Closes the results dropdown when clicking outside.
  useClickOutside([inputRef, resultsRef], () => setShowResults(false));

  // Sync external value changes when the input is not dirty.
  useEffect(() => {
    if (!isDirty && value?.title !== query) {
      setQuery(value?.title || "");
    }
  }, [value, query, isDirty]);

  // ─────────────────────────────
  // New: Clear query on blur if no value is selected
  // ─────────────────────────────
  const handleBlur = useCallback(() => {
    if (!value) {
      setQuery("");
    }
  }, [value]);

  // ─────────────────────────────
  // Computed Classes
  // ─────────────────────────────
  const inputClasses = clsx(
    "w-full h-11 bg-background border-2 rounded-md",
    "focus:outline-none focus:ring-2 focus:ring-primary/30",
    "transition-colors duration-200",
    error ? "border-red-500" : "border-input hover:border-primary/50",
    isRTL ? "pr-11 pl-11" : "pl-11 pr-11"
  );

  // ─────────────────────────────
  // Render Component
  // ─────────────────────────────
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
          {/* Render Icon or Prefix */}
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

          {/* Input Field */}
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
          />

          {/* Right-side Icon: Loader or Clear Button */}
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

        {/* Error Message */}
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

        {/* Search Results Dropdown */}
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

// Export memoized component for performance optimization.
export default memo(SearchComponent) as typeof SearchComponent;
