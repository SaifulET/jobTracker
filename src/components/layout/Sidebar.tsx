"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  User,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CalendarCheck,
  Award,
  Bell,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenAddJob?: () => void;
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ onOpenAddJob, className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/" || pathname === "/dashboard",
    },
    {
      name: "Applications",
      href: "/applications",
      icon: FolderKanban,
      active: pathname.startsWith("/applications") || pathname.startsWith("/jobs"),
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-64 bg-card border-r border-border text-card-foreground select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-border">
        <div className="h-9 w-9 rounded-xl bg-[#659364] flex items-center justify-center text-white shadow-sm transition-transform hover:scale-105 active:scale-95 duration-150">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-foreground">
              JobTracker
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            Career Pipeline Manager
          </p>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
          Overview
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group",
                item.active
                  ? "bg-[#659364] text-white shadow-sm"
                  : "text-muted-foreground hover:bg-[#659364]/10 hover:text-[#4e794d] dark:hover:text-[#8cb88b] hover:translate-x-1"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110 duration-200",
                    item.active ? "text-white" : "text-muted-foreground group-hover:text-[#4e794d] dark:group-hover:text-[#8cb88b]"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.active && (
                <ChevronRight className="h-4 w-4 opacity-80" />
              )}
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
          Quick Filters
        </div>
        <Link
          href="/applications?status=Interview"
          onClick={onNavigate}
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-purple-100 hover:text-purple-900 dark:hover:bg-purple-950/70 dark:hover:text-purple-300 hover:translate-x-1 transition-all duration-150 group"
        >
          <span className="flex items-center gap-2.5">
            <CalendarCheck className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span>Interviews</span>
          </span>
          <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="/applications?status=Offer"
          onClick={onNavigate}
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-emerald-100 hover:text-emerald-900 dark:hover:bg-emerald-950/70 dark:hover:text-emerald-300 hover:translate-x-1 transition-all duration-150 group"
        >
          <span className="flex items-center gap-2.5">
            <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Offers</span>
          </span>
          <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="/applications?status=Follow+Up"
          onClick={onNavigate}
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-amber-950/70 dark:hover:text-amber-300 hover:translate-x-1 transition-all duration-150 group"
        >
          <span className="flex items-center gap-2.5">
            <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Follow-Ups Due</span>
          </span>
          <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      {/* Sidebar Footer Feature Card */}
      <div className="p-4 border-t border-border">
        <div className="p-3.5 rounded-xl bg-[#659364]/10 dark:bg-[#659364]/15 border-2 border-[#659364]/30 shadow-2xs hover:border-[#659364]/50 transition-all">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4e794d] dark:text-[#8cb88b]">
            <Sparkles className="h-4 w-4 text-[#659364] dark:text-[#8cb88b]" />
            <span>Gmail Follow-Ups</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed font-medium">
            One-click Gmail prefilled compose &amp; interview logs.
          </p>
        </div>
      </div>
    </aside>
  );
}
