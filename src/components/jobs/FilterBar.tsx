"use client";

import React from "react";
import { JOB_STATUSES } from "@/types/job";
import { Button } from "@/components/ui/Button";
import {
  ArrowUpDown,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

interface FilterBarProps {
  status: string;
  onStatusChange: (status: string) => void;
  location: string;
  onLocationChange: (loc: string) => void;
  company: string;
  onCompanyChange: (company: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (order: "asc" | "desc") => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  status,
  onStatusChange,
  location,
  onLocationChange,
  company,
  onCompanyChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onReset,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-card border-2 border-border/70 shadow-xs">
      {/* Status Filter */}
      <div className="relative flex items-center min-w-[145px] flex-1 sm:flex-none">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`h-9 w-full rounded-xl border ${status !== "All" ? "border-[#659364] bg-[#659364]/10 dark:bg-[#659364]/20 text-[#4e794d] dark:text-[#8cb88b] font-bold" : "border-input bg-background font-medium"} pl-3 pr-8 py-1 text-xs shadow-2xs appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#659364] transition-all`}
        >
          <option value="All">All Statuses</option>
          {JOB_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      </div>

      {/* Location Filter */}
      <div className="flex items-center min-w-[140px] flex-1 sm:flex-none">
        <input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Filter location..."
          className={`h-9 w-full rounded-xl border ${location ? "border-[#659364] bg-[#659364]/10 dark:bg-[#659364]/20 text-[#4e794d] dark:text-[#8cb88b] font-semibold" : "border-input bg-background font-medium"} px-3 py-1 text-xs shadow-2xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#659364] transition-all`}
        />
      </div>

      {/* Company Filter */}
      <div className="flex items-center min-w-[140px] flex-1 sm:flex-none">
        <input
          type="text"
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          placeholder="Filter company..."
          className={`h-9 w-full rounded-xl border ${company ? "border-[#659364] bg-[#659364]/10 dark:bg-[#659364]/20 text-[#4e794d] dark:text-[#8cb88b] font-semibold" : "border-input bg-background font-medium"} px-3 py-1 text-xs shadow-2xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#659364] transition-all`}
        />
      </div>

      {/* Sort By Field */}
      <div className="relative flex items-center min-w-[165px] flex-1 sm:flex-none">
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="h-9 w-full rounded-xl border border-input bg-background pl-3 pr-8 py-1 text-xs font-medium shadow-2xs appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#659364] transition-all"
        >
          <option value="applicationDate">Sort: Application Date</option>
          <option value="companyName">Sort: Company</option>
          <option value="jobTitle">Sort: Job Title</option>
          <option value="status">Sort: Status</option>
          <option value="followUpCount">Sort: Follow-Ups</option>
          <option value="createdAt">Sort: Created Date</option>
          <option value="updatedAt">Sort: Last Updated</option>
        </select>
        <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      </div>

      {/* Sort Order Toggle */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
        className="h-9 px-3 gap-1.5 text-xs font-semibold rounded-xl hover:border-blue-400 transition-all hover:scale-105 active:scale-95 shadow-2xs"
        title={sortOrder === "asc" ? "Ascending order" : "Descending order"}
      >
        <ArrowUpDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
        <span>{sortOrder === "asc" ? "Oldest / A-Z" : "Newest / Z-A"}</span>
      </Button>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 px-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 gap-1.5 ml-auto rounded-xl transition-all hover:scale-105 active:scale-95 shadow-2xs"
        >
          <RotateCcw className="h-3.5 w-3.5 animate-in spin-in-180" />
          <span>Reset Filters</span>
        </Button>
      )}
    </div>
  );
}
