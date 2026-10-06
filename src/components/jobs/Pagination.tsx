"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  if (total === 0) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  // Generate page numbers array with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-2 text-xs">
      {/* Left: Summary and Limit Selector */}
      <div className="flex items-center gap-3 text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{start}–{end}</strong> of{" "}
          <strong className="text-foreground">{total}</strong> applications
        </span>

        <div className="flex items-center gap-1.5 ml-2 border-l border-border pl-3">
          <span>Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 py-0 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Right: Page Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="h-8 px-2.5 gap-1 text-xs"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, i) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 py-1 text-muted-foreground"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </span>
              );
            }

            const pageNum = p as number;
            const isCurrent = pageNum === page;

            return (
              <Button
                key={pageNum}
                variant={isCurrent ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 p-0 text-xs font-semibold ${
                  isCurrent ? "shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="h-8 px-2.5 gap-1 text-xs"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
