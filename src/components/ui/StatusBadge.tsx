"use client";

import React, { useState } from "react";
import { JobStatus, JOB_STATUSES } from "@/types/job";
import { STATUS_CONFIG, cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ChevronDown,
  Loader2,
  Bookmark,
  Send,
  Bell,
  CalendarCheck,
  Code2,
  Award,
  XCircle,
  Ban,
  Check,
} from "lucide-react";

interface StatusBadgeProps {
  status: JobStatus;
  onChange?: (newStatus: JobStatus) => Promise<void> | void;
  interactive?: boolean;
  size?: "sm" | "default" | "lg";
  className?: string;
}

const STATUS_ICONS: Record<JobStatus, React.ComponentType<{ className?: string }>> = {
  Saved: Bookmark,
  Applied: Send,
  "Follow Up": Bell,
  Interview: CalendarCheck,
  "Technical Test": Code2,
  Offer: Award,
  Rejected: XCircle,
  Withdrawn: Ban,
};

export function StatusBadge({
  status,
  onChange,
  interactive = true,
  size = "default",
  className,
}: StatusBadgeProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const config = STATUS_CONFIG[status] || STATUS_CONFIG["Saved"];
  const StatusIcon = STATUS_ICONS[status] || Bookmark;

  const handleStatusSelect = async (newStatus: JobStatus) => {
    if (newStatus === status || !onChange) return;
    try {
      setIsUpdating(true);
      await onChange(newStatus);
    } finally {
      setIsUpdating(false);
      setOpen(false);
    }
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium gap-1.5",
    default: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-semibold gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3 shrink-0",
    default: "h-3.5 w-3.5 shrink-0",
    lg: "h-4 w-4 shrink-0",
  };

  const badgeElement = (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border transition-all duration-200 shadow-2xs select-none",
        config.badgeClass,
        sizeClasses[size],
        interactive && onChange && "cursor-pointer hover:shadow-sm hover:scale-[1.04] active:scale-95 hover:brightness-105",
        className
      )}
    >
      <StatusIcon className={cn(iconSizes[size], config.textClass)} />
      <span className="whitespace-nowrap font-bold tracking-tight">{config.label}</span>
      {isUpdating && <Loader2 className="h-3 w-3 animate-spin ml-0.5" />}
      {interactive && onChange && !isUpdating && (
        <ChevronDown className={cn("h-3 w-3 opacity-60 ml-0.5 shrink-0 transition-transform duration-200", open && "rotate-180")} />
      )}
    </span>
  );

  if (!interactive || !onChange) {
    return badgeElement;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={isUpdating}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full transition-transform active:scale-95"
        >
          {badgeElement}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="z-50 min-w-[170px] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-xl animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
      >
        <div className="px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
          Change Status
        </div>
        {JOB_STATUSES.map((s) => {
          const itemConfig = STATUS_CONFIG[s];
          const ItemIcon = STATUS_ICONS[s] || Bookmark;
          const isSelected = s === status;
          return (
            <DropdownMenuItem
              key={s}
              onClick={() => handleStatusSelect(s)}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-lg px-2.5 py-1.5 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground font-semibold gap-2",
                isSelected && "bg-accent font-bold"
              )}
            >
              <ItemIcon className={cn("h-3.5 w-3.5", itemConfig.textClass)} />
              <span className="flex-1">{s}</span>
              {isSelected && (
                <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
