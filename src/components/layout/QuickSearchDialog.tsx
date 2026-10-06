"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { IJob } from "@/types/job";
import { formatDate, getCompanyFaviconUrl, getInitials } from "@/lib/utils";
import {
  Search,
  Briefcase,
  Plus,
  User,
  LayoutDashboard,
  CalendarCheck,
  Award,
  Send,
  ArrowRight,
  Sparkles,
  ExternalLink,
  MapPin,
  Calendar,
  X,
  Clock,
  Loader2,
} from "lucide-react";

interface QuickSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectJob?: (job: IJob) => void;
  onOpenAddJob?: () => void;
}

export function QuickSearchDialog({
  open,
  onOpenChange,
  onSelectJob,
  onOpenAddJob,
}: QuickSearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Search API fetch with debounce
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (query.trim()) {
          params.set("search", query.trim());
          params.set("limit", "8");
        } else {
          // If empty, fetch top 5 recent jobs as suggestions
          params.set("limit", "5");
          params.set("sortBy", "updatedAt");
          params.set("sortOrder", "desc");
        }

        const res = await fetch(`/api/jobs?${params.toString()}`);
        const data = await res.json();
        if (data.success && data.data) {
          setResults(data.data);
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error("Quick search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, open]);

  // Global Keyboard shortcut listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelectJob = (job: IJob) => {
    onOpenChange(false);
    if (onSelectJob) {
      onSelectJob(job);
    } else {
      router.push(`/jobs/${job._id}`);
    }
  };

  const handleNavigate = (path: string) => {
    onOpenChange(false);
    router.push(path);
  };

  const handleAddJobAction = () => {
    onOpenChange(false);
    if (onOpenAddJob) {
      onOpenAddJob();
    } else {
      router.push("/jobs/new");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="lg"
        hideClose
        className="p-0 overflow-hidden rounded-2xl max-w-2xl bg-card border border-border shadow-2xl gap-0"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/70 bg-background/90">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search applications by role, company, recruiter, location..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none border-none"
          />
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />
          ) : query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-muted-foreground hover:text-foreground rounded"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          )}
        </div>

        {/* Results / Navigation Body */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3">
          {/* Quick Actions Bar */}
          {!query && (
            <div className="px-2 pt-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2 px-1">
                Quick Actions
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={handleAddJobAction}
                  className="flex items-center gap-2 p-2 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors text-left"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>+ Add Job</span>
                </button>
                <button
                  onClick={() => handleNavigate("/applications?status=Interview")}
                  className="flex items-center gap-2 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-colors text-left"
                >
                  <CalendarCheck className="h-4 w-4 shrink-0" />
                  <span>Interviews</span>
                </button>
                <button
                  onClick={() => handleNavigate("/applications?status=Offer")}
                  className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors text-left"
                >
                  <Award className="h-4 w-4 shrink-0" />
                  <span>Offers</span>
                </button>
                <button
                  onClick={() => handleNavigate("/applications?status=Follow+Up")}
                  className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors text-left"
                >
                  <Send className="h-4 w-4 shrink-0" />
                  <span>Follow-ups</span>
                </button>
              </div>
            </div>
          )}

          {/* Job Results List */}
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 px-3">
              {query ? `Search Results (${results.length})` : "Recent Applications"}
            </span>

            {results.length === 0 && !isLoading ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No matching applications found for &quot;<strong>{query}</strong>&quot;.
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((job) => {
                  const favicon = getCompanyFaviconUrl(
                    job.websiteLink,
                    job.companyName
                  );
                  return (
                    <div
                      key={job._id}
                      onClick={() => handleSelectJob(job)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/70 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 text-xs font-bold text-foreground">
                          {favicon ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={favicon}
                              alt={job.companyName}
                              className="h-5 w-5 object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            getInitials(job.companyName)
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {job.jobTitle}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="font-semibold text-foreground/80">
                              {job.companyName}
                            </span>
                            {job.location && (
                              <>
                                <span>•</span>
                                <span className="truncate">{job.location}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{formatDate(job.applicationDate)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <StatusBadge
                          status={job.status}
                          size="sm"
                          interactive={false}
                        />
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Navigation Pages */}
          {!query && (
            <div className="pt-2 border-t border-border/60">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5 px-3">
                Pages &amp; Views
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavigate("/")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4 text-[#659364] dark:text-[#8cb88b]" />
                    Dashboard Overview
                  </span>
                  <span className="text-[11px] opacity-60">Go to dashboard →</span>
                </button>
                <button
                  onClick={() => handleNavigate("/applications")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-500" />
                    All Applications Table
                  </span>
                  <span className="text-[11px] opacity-60">Browse table →</span>
                </button>
                <button
                  onClick={() => handleNavigate("/profile")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-500" />
                    Candidate Profile &amp; CV Settings
                  </span>
                  <span className="text-[11px] opacity-60">Edit profile →</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-muted/40 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Press <strong>ESC</strong> to close</span>
          {query && (
            <button
              onClick={() => handleNavigate(`/applications?search=${encodeURIComponent(query)}`)}
              className="font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View full results in table</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
