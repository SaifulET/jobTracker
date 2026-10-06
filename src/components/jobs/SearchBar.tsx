"use client";

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search jobs by title, company, email, location...",
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState(value);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(query);
    }, 350);

    return () => clearTimeout(timer);
  }, [query, onChange]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  return (
    <div className={`relative flex items-center w-full ${className || ""}`}>
      <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-[#659364]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex h-11 w-full rounded-2xl border-2 border-border/70 bg-card pl-10 pr-10 py-2 text-sm font-medium shadow-xs transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#659364]/30 focus-visible:border-[#659364]"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            onChange("");
          }}
          className="absolute right-3 p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all hover:scale-110 active:scale-95"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
