import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, isValid } from "date-fns";
import { JobStatus } from "@/types/job";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | undefined | null): string {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(d)) {
      const fallback = new Date(date);
      return isValid(fallback) ? format(fallback, "dd MMM yyyy") : "-";
    }
    return format(d, "dd MMM yyyy");
  } catch {
    return "-";
  }
}

export function formatDateTime(date: string | Date | undefined | null): string {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(d)) {
      const fallback = new Date(date);
      return isValid(fallback) ? format(fallback, "dd MMM yyyy, hh:mm a") : "-";
    }
    return format(d, "dd MMM yyyy, hh:mm a");
  } catch {
    return "-";
  }
}

export function formatInputDate(date: string | Date | undefined | null): string {
  if (!date) return "";
  try {
    const d = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(d)) {
      const fallback = new Date(date);
      return isValid(fallback) ? format(fallback, "yyyy-MM-dd") : "";
    }
    return format(d, "yyyy-MM-dd");
  } catch {
    return "";
  }
}

export function getInitials(name: string): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getCompanyFaviconUrl(
  websiteUrl?: string,
  _companyName?: string
): string | null {
  if (!websiteUrl) return null;
  try {
    const url = new URL(websiteUrl);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
  } catch {
    return null;
  }
}

export interface StatusConfig {
  label: JobStatus;
  badgeClass: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotClass: string;
  pingClass?: string;
}

export const STATUS_CONFIG: Record<JobStatus, StatusConfig> = {
  Saved: {
    label: "Saved",
    badgeClass: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700",
    bgClass: "bg-slate-500/15",
    textClass: "text-slate-700 dark:text-slate-300",
    borderClass: "border-slate-400",
    dotClass: "bg-slate-500",
  },
  Applied: {
    label: "Applied",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800 hover:bg-blue-200 dark:hover:bg-blue-900",
    bgClass: "bg-blue-500/15",
    textClass: "text-blue-700 dark:text-blue-400",
    borderClass: "border-blue-500",
    dotClass: "bg-blue-600",
  },
  "Follow Up": {
    label: "Follow Up",
    badgeClass: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-400 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-900 shadow-xs",
    bgClass: "bg-amber-500/15",
    textClass: "text-amber-700 dark:text-amber-400",
    borderClass: "border-amber-500",
    dotClass: "bg-amber-500",
    pingClass: "bg-amber-400",
  },
  Interview: {
    label: "Interview",
    badgeClass: "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800 hover:bg-purple-200 dark:hover:bg-purple-900 shadow-xs",
    bgClass: "bg-purple-500/15",
    textClass: "text-purple-700 dark:text-purple-400",
    borderClass: "border-purple-500",
    dotClass: "bg-purple-600",
    pingClass: "bg-purple-400",
  },
  "Technical Test": {
    label: "Technical Test",
    badgeClass: "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800 hover:bg-indigo-200 dark:hover:bg-indigo-900",
    bgClass: "bg-indigo-500/15",
    textClass: "text-indigo-700 dark:text-indigo-400",
    borderClass: "border-indigo-500",
    dotClass: "bg-indigo-600",
  },
  Offer: {
    label: "Offer",
    badgeClass: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-900 font-bold shadow-xs",
    bgClass: "bg-emerald-500/15",
    textClass: "text-emerald-700 dark:text-emerald-400",
    borderClass: "border-emerald-500",
    dotClass: "bg-emerald-500",
    pingClass: "bg-emerald-400",
  },
  Rejected: {
    label: "Rejected",
    badgeClass: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800 hover:bg-rose-200 dark:hover:bg-rose-900",
    bgClass: "bg-rose-500/15",
    textClass: "text-rose-700 dark:text-rose-400",
    borderClass: "border-rose-500",
    dotClass: "bg-rose-600",
  },
  Withdrawn: {
    label: "Withdrawn",
    badgeClass: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700",
    bgClass: "bg-zinc-500/15",
    textClass: "text-zinc-700 dark:text-zinc-400",
    borderClass: "border-zinc-500",
    dotClass: "bg-zinc-500",
  },
};

export function generateGmailComposeUrl({
  to,
  subject,
  body,
}: {
  to?: string;
  subject?: string;
  body?: string;
}): string {
  const params = new URLSearchParams();
  params.set("view", "cm");
  params.set("fs", "1");
  if (to) params.set("to", to);
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);

  return `https://mail.google.com/mail/?${params.toString()}`;
}
