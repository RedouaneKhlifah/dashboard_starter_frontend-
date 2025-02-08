import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Search, Command } from "lucide-react";

export interface SearchInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput = ({
  setSearch,
  placeholder,
  ...props
}: SearchInputProps) => {
  return (
    <div className="relative w-1/3 max-w-xs">
      <div className="flex items-center h-11 gap-2 px-4 py-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
        <Search className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        <input
          {...props}
          id="search-input"
          type="text"
          role="searchbox"
          placeholder={placeholder}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground placeholder:text-sm"
          aria-label="Search input"
        />

        <kbd className="hidden lg:flex items-center gap-1 px-2 py-1 text-xs border rounded bg-muted text-muted-foreground">
          <Command className="w-3 h-3" aria-hidden="true" /> K
        </kbd>
      </div>
    </div>
  );
};

export default SearchInput;
