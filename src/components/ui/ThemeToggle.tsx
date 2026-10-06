"use client";

import * as React from "react";
import { SunMedium, MoonStar } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8.5 w-16 rounded-full bg-muted/60 border border-border/60 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center h-8.5 w-[62px] p-1 rounded-full bg-slate-200/90 dark:bg-slate-800 border border-slate-300 dark:border-slate-700/80 shadow-inner transition-colors duration-300 group active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#659364]/50 select-none"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme"
    >
      {/* Background Track Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 text-muted-foreground pointer-events-none">
        <SunMedium className={cn("h-3.5 w-3.5 transition-opacity duration-300", isDark ? "opacity-30" : "opacity-0")} />
        <MoonStar className={cn("h-3.5 w-3.5 transition-opacity duration-300", isDark ? "opacity-0" : "opacity-30")} />
      </div>

      {/* Smooth Sliding Pill Knob */}
      <div
        className={cn(
          "relative z-10 flex items-center justify-center h-6.5 w-6.5 rounded-full shadow-md transition-all duration-300 ease-out transform",
          isDark
            ? "translate-x-[28px] bg-slate-900 text-blue-400 border border-slate-700"
            : "translate-x-0 bg-white text-amber-500 border border-slate-200/80"
        )}
      >
        {isDark ? (
          <MoonStar className="h-3.5 w-3.5 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <SunMedium className="h-3.5 w-3.5 transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>
    </button>
  );
}


