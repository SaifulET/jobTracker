"use client";

import React from "react";
import { Plus, Menu, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface NavbarProps {
  onOpenMobileMenu?: () => void;
  onOpenAddJob?: () => void;
  title?: string;
  subtitle?: string;
}

export function Navbar({
  onOpenMobileMenu,
  onOpenAddJob,
  title = "Job Applications",
  subtitle = "Track, organize, and accelerate your job search pipeline",
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 md:px-8 backdrop-blur-md">
      {/* Left side: Mobile menu toggle + Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9 text-muted-foreground"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="hidden sm:block">
          <h1 className="text-lg font-bold text-foreground tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground line-clamp-1">{subtitle}</p>
        </div>

        {/* Mobile brand header when title is hidden */}
        <div className="sm:hidden flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-[#659364] flex items-center justify-center text-white shadow-sm">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-sm">JobTracker</span>
        </div>
      </div>

      {/* Right side: Theme Toggle & Add Job button */}
      <div className="flex items-center gap-2 md:gap-3">
        <ThemeToggle />

        {onOpenAddJob && (
          <Button
            onClick={onOpenAddJob}
            variant="default"
            size="sm"
            className="gap-1.5 shadow-md font-bold rounded-xl bg-[#659364] hover:bg-[#547c53] text-white transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Job</span>
            <span className="sm:hidden">Add</span>
          </Button>
        )}
      </div>
    </header>
  );
}
