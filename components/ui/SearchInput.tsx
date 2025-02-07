import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Search, Command } from 'lucide-react';

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchChange?: (value: string) => void;
  debounceDelay?: number;
}

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): {
  (this: ThisParameterType<T>, ...args: Parameters<T>): void;
  cancel: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debounced = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debounced;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearchChange, debounceDelay = 300, placeholder, ...props }, ref) => {
    const [query, setQuery] = useState('');

    const debouncedSearch = useCallback(
      debounce((value: string) => {
        onSearchChange?.(value);
      }, debounceDelay),
      [onSearchChange, debounceDelay]
    );

    useEffect(() => {
      return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    useEffect(() => {
      debouncedSearch(query);
    }, [query, debouncedSearch]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        (ref as React.MutableRefObject<HTMLInputElement>)?.current?.focus();
      }
    };

    return (
      <div className="relative w-1/3 max-w-xs">
        <div className="flex items-center h-11 gap-2 px-4 py-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
          <Search className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
          <input
            {...props}
            ref={ref}
            type="text"
            role="searchbox"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none placeholder:text-muted-foreground placeholder:text-sm"
            aria-label="Search input"
          />
          
          <kbd className="hidden lg:flex items-center gap-1 px-2 py-1 text-xs border rounded bg-muted text-muted-foreground">
            <Command className="w-3 h-3" aria-hidden="true" /> K
          </kbd>
        </div>
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
export default SearchInput;