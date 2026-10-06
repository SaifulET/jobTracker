"use client";

import React from "react";
import { DashboardStats } from "@/types/job";
import {
  Briefcase,
  CheckCircle2,
  CalendarCheck,
  Award,
  Send,
  TrendingUp,
  Percent,
  Clock,
  Activity,
  Bell,
} from "lucide-react";

interface DashboardStatsCardsProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export function DashboardStatsCards({
  stats,
  isLoading,
}: DashboardStatsCardsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-border/70 bg-card shadow-xs animate-pulse space-y-3"
          >
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Applications",
      value: stats.total,
      subtitle: `${stats.applied} actively in review`,
      icon: Briefcase,
      miniIcon: Activity,
      color: "text-[#659364] dark:text-[#8cb88b]",
      bg: "bg-[#659364]/15 dark:bg-[#659364]/20",
      border: "border-[#659364]/20 dark:border-[#659364]/30 hover:border-[#659364]",
      topBar: "bg-[#659364]",
      indicator: "text-[#659364] dark:text-[#8cb88b]",
    },
    {
      title: "Interviews & Tests",
      value: stats.interview + stats.technicalTest,
      subtitle: `${stats.interviewRate}% interview conversion`,
      icon: CalendarCheck,
      miniIcon: CalendarCheck,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-950",
      border: "border-purple-200 dark:border-purple-900 hover:border-purple-500",
      topBar: "bg-purple-600",
      indicator: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Job Offers",
      value: stats.offer,
      subtitle: `${stats.applicationSuccessRate}% success rate`,
      icon: Award,
      miniIcon: Award,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-950",
      border: "border-emerald-200 dark:border-emerald-900 hover:border-emerald-500",
      topBar: "bg-emerald-600",
      indicator: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Follow-Ups Due",
      value: stats.followUpRequired,
      subtitle: "Touchpoints required",
      icon: Send,
      miniIcon: Bell,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-950",
      border: "border-amber-200 dark:border-amber-900 hover:border-amber-500",
      topBar: "bg-amber-500",
      indicator: "text-amber-600 dark:text-amber-400",
    },
  ];

  const secondaryStats = [
    {
      label: "Interview Rate",
      value: `${stats.interviewRate}%`,
      description: "Interviews vs Total",
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-950/70",
      borderHover: "hover:border-purple-400",
    },
    {
      label: "Offer Rate",
      value: `${stats.offerRate}%`,
      description: "Offers vs Interviews",
      icon: Percent,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-950/70",
      borderHover: "hover:border-emerald-400",
    },
    {
      label: "Saved Drafts",
      value: stats.saved,
      description: "Bookmarked for later",
      icon: Clock,
      color: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-100 dark:bg-slate-800",
      borderHover: "hover:border-slate-400",
    },
    {
      label: "Success Rate",
      value: `${stats.applicationSuccessRate}%`,
      description: "Offers vs Applied",
      icon: CheckCircle2,
      color: "text-[#659364] dark:text-[#8cb88b]",
      bg: "bg-[#659364]/15 dark:bg-[#659364]/20",
      borderHover: "hover:border-[#659364]",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Primary KPI Cards with hover lift animation & solid color accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              style={{ animationDelay: `${idx * 60}ms` }}
              className={`p-5 rounded-2xl border-2 ${item.border} bg-card text-card-foreground shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group cursor-pointer animate-enter`}
            >
              {/* Solid top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${item.topBar}`} />

              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {item.title}
                </span>
                <div className={`p-2.5 rounded-xl ${item.bg} ${item.color} transition-transform group-hover:scale-110 group-hover:rotate-6 duration-300 shadow-2xs`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-foreground transition-transform group-hover:scale-105 duration-200">
                  {item.value}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                <item.miniIcon className={`h-3.5 w-3.5 shrink-0 ${item.indicator}`} />
                <span className="truncate">{item.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Metrics Strip with interactive hover highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-card border border-border text-xs shadow-xs animate-enter delay-200">
        {secondaryStats.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              style={{ animationDelay: `${200 + idx * 40}ms` }}
              className={`flex items-center gap-3 p-2.5 rounded-xl border border-transparent ${metric.borderHover} hover:bg-muted/60 transition-all duration-200 group cursor-default animate-enter`}
            >
              <div className={`p-2.5 rounded-xl ${metric.bg} ${metric.color} border border-border/50 group-hover:scale-110 transition-transform duration-200 shadow-2xs shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-foreground">
                    {metric.value}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground truncate">
                    {metric.label}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground block truncate">
                  {metric.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
