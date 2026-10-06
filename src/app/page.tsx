"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardStatsCards } from "@/components/dashboard/DashboardStatsCards";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { ApplicationsTimelineChart } from "@/components/dashboard/ApplicationsTimelineChart";
import { RecentApplicationsList } from "@/components/dashboard/RecentApplicationsList";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { JobFormModal } from "@/components/jobs/JobFormModal";
import { DashboardStats, IJob, JobStatus } from "@/types/job";
import { Button } from "@/components/ui/Button";
import {
  Briefcase,
  BarChart3,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Activity,
  Bell,
  CalendarCheck,
  Send,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const handleJobUpdated = () => {
      fetchStats();
    };

    window.addEventListener("job-updated", handleJobUpdated);
    return () => window.removeEventListener("job-updated", handleJobUpdated);
  }, [fetchStats]);

  const handleStatusChange = async (jobId: string, status: JobStatus) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Status updated to ${status}`);
        fetchStats();
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <AppLayout
      title="Executive Career Dashboard"
      subtitle="Comprehensive view of your pipeline performance, status breakdowns, and active applications"
      onJobCreated={fetchStats}
    >
      <div className="space-y-8">
        {/* Modern Executive Hero Banner with Architectural Blueprint Grid & Telemetry */}
        <div className="relative overflow-hidden rounded-2xl bg-card border border-border/80 p-6 md:p-7 text-card-foreground shadow-xs animate-enter">
          {/* Subtle Geometric Architectural Blueprint Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:28px_28px] opacity-20 dark:opacity-25 pointer-events-none" />

          <div className="relative z-10 space-y-4">
            {/* Top Row: Left Pill & Right Synced Status */}
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border border-border text-xs font-semibold text-foreground shadow-2xs">
                <Activity className="h-3.5 w-3.5 text-[#659364] dark:text-[#8cb88b] shrink-0" />
                <span className="font-bold text-foreground">Career Telemetry</span>
                <span className="text-muted-foreground font-normal">• Pipeline Active</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-400 shadow-2xs">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Synchronized</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchStats}
                  className="bg-card hover:bg-muted border-border text-foreground font-bold text-xs gap-1.5 h-8 px-2.5 transition-all hover:scale-105 active:scale-95 shadow-2xs"
                  title="Refresh pipeline data"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
            </div>

            {/* Middle Row: Headline & Description */}
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                Welcome back, Saiful
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl font-medium">
                Real-time pipeline monitoring, application tracking, and recruiter interaction intelligence.
              </p>
            </div>

            {/* Bottom Row: Interactive Telemetry Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/applications?status=Follow+Up"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 hover:bg-muted border border-border/70 hover:border-amber-500/50 text-xs text-foreground transition-all hover:scale-105 active:scale-95 shadow-2xs group"
                >
                  <Bell className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span className="font-extrabold">{stats?.followUpRequired || 0}</span>
                  <span className="text-muted-foreground font-medium">Follow-Ups Due</span>
                </Link>

                <Link
                  href="/applications?status=Interview"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 hover:bg-muted border border-border/70 hover:border-purple-500/50 text-xs text-foreground transition-all hover:scale-105 active:scale-95 shadow-2xs group"
                >
                  <CalendarCheck className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                  <span className="font-extrabold">{(stats?.interview || 0) + (stats?.technicalTest || 0)}</span>
                  <span className="text-muted-foreground font-medium">Active Interviews</span>
                </Link>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 border border-border/70 text-xs text-foreground shadow-2xs">
                  <Send className="h-3.5 w-3.5 text-[#659364] dark:text-[#8cb88b] shrink-0" />
                  <span className="font-extrabold">{stats?.applied || 0}</span>
                  <span className="text-muted-foreground font-medium">In Review</span>
                </div>
              </div>

              <Link
                href="/applications"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#659364] hover:bg-[#547c53] text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-xs group"
              >
                <span>View All Applications</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Dynamic KPI Cards */}
        <div className="animate-enter stagger-1">
          <DashboardStatsCards stats={stats} isLoading={isLoading} />
        </div>

        {/* Charts & Graphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Applications by Status Breakdown */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-card border border-border shadow-xs hover:border-[#659364]/50 hover:shadow-md transition-all duration-300 space-y-2 animate-enter stagger-2">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#659364]/15 text-[#4e794d] dark:text-[#8cb88b]">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Applications by Status
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Current distribution across hiring stages
                  </p>
                </div>
              </div>

              <Link
                href="/applications"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 group"
              >
                <span>View Table</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <StatusDistributionChart
              data={stats?.statusDistribution || []}
            />
          </div>

          {/* Applications Timeline Chart */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-card border border-border shadow-xs hover:border-purple-500/40 hover:shadow-md transition-all duration-300 space-y-2 animate-enter stagger-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Pipeline Trends (Last 6 Months)
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Applications submitted vs. interviews and offers
                  </p>
                </div>
              </div>
            </div>

            <ApplicationsTimelineChart
              data={stats?.timelineData || []}
            />
          </div>
        </div>

        {/* Recent Applications Section */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all duration-300 space-y-4 animate-enter stagger-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Recent Applications &amp; Activity
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Quick access to your most recently updated job opportunities
                </p>
              </div>
            </div>

            <Link
              href="/applications"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 group"
            >
              <span>All Applications</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <RecentApplicationsList
            jobs={stats?.recentJobs || []}
            onSelectJob={setSelectedJob}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Selected Job Modal */}
      <JobDetailModal
        open={Boolean(selectedJob)}
        onOpenChange={(open) => !open && setSelectedJob(null)}
        job={selectedJob}
        onStatusChange={async (id, s) => {
          await handleStatusChange(id, s);
          setSelectedJob((prev) => (prev ? { ...prev, status: s } : null));
        }}
      />

      {/* Add Job Modal */}
      <JobFormModal
        open={isAddJobOpen}
        onOpenChange={setIsAddJobOpen}
        onSuccess={() => {
          setIsAddJobOpen(false);
          fetchStats();
        }}
      />
    </AppLayout>
  );
}
