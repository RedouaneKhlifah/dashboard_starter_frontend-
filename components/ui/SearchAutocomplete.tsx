"use client";
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { debounce } from 'lodash';
import { Search, X, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface SearchResult {
  id: string;
  title: string;
}

interface SearchAutocompleteProps {
  id: string;
  label?: string;
  onSearch: (query: string) => Promise<SearchResult[]>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minChars?: number;
  debounceMs?: number;
  required?: boolean;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
}

const SearchAutocomplete = memo(({
  id,
  label,
  onSearch,
  value = '',
  onChange,
  placeholder = 'Search...',
  minChars = 2,
  debounceMs = 300,
  required = false,
  error,
  className = '',
  icon,
  prefix
}: SearchAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsRTL(document.documentElement.dir === "rtl");
  }, []);

  const handleSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length >= minChars) {
        try {
          setIsLoading(true);
          const searchResults = await onSearch(searchQuery);
          setResults(prev => 
            JSON.stringify(prev) === JSON.stringify(searchResults) ? prev : searchResults
          );
          setShowResults(true);
        } catch (error) {
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, debounceMs),
    [onSearch, minChars, debounceMs]
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    onChange?.('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === query) return;
    
    setQuery(value);
    setSelectedIndex(-1);
    handleSearch(value);
  }, [query, handleSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  }, [results, selectedIndex]);

  const handleResultClick = useCallback((result: SearchResult) => {
    setQuery(result.title);
    onChange?.(result.id);
    setShowResults(false);
    setSelectedIndex(-1);
  }, [onChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            <div className={clsx(
              "absolute top-0 bottom-0 flex items-center",
              isRTL ? "right-3" : "left-3"
            )}>
              {icon && <span className="text-muted-foreground">{icon}</span>}
              {prefix && <span className="text-sm text-muted-foreground">{prefix}</span>}
            </div>
          )}

          <input
            ref={inputRef}
            id={id}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={clsx(
              "w-full h-11 bg-background",
              "border-2 rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-primary/30",
              "transition-colors duration-200",
              error ? "border-red-500" : "border-input hover:border-primary/50",
              isRTL ? "pr-11 pl-11" : "pl-11 pr-11"
            )}
            aria-expanded={showResults}
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${id}-error` : undefined}
          />

          <div className={clsx(
            "absolute top-0 bottom-0 flex items-center",
            isRTL ? "left-3" : "right-3"
          )}>
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : query && (
              <button
                onClick={clearSearch}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {error && (
          <p
            id={`${id}-error`}
            className="mt-1 text-xs text-red-500 flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
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
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="font-medium text-foreground">
                      {result.title}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-muted-foreground flex flex-col items-center">
                <Search className="w-6 h-6 mb-2" />
                <p>No results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});


export { SearchAutocomplete };
export default SearchAutocomplete;