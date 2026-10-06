"use client";

import React from "react";
import Link from "next/link";
import { IJob, JobStatus } from "@/types/job";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatDate, getCompanyFaviconUrl, getInitials } from "@/lib/utils";
import { ArrowRight, Building2, Calendar, Clock, ExternalLink } from "lucide-react";

interface RecentApplicationsListProps {
  jobs: IJob[];
  onSelectJob: (job: IJob) => void;
  onStatusChange?: (jobId: string, status: JobStatus) => Promise<void>;
}

export function RecentApplicationsList({
  jobs,
  onSelectJob,
  onStatusChange,
}: RecentApplicationsListProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-muted-foreground">
        No recent applications found.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {jobs.map((job, idx) => {
        const favicon = getCompanyFaviconUrl(job.websiteLink, job.companyName);
        return (
          <div
            key={job._id}
            style={{ animationDelay: `${idx * 40}ms` }}
            onClick={() => onSelectJob(job)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-card border-2 border-border/70 hover:border-[#659364]/60 hover:bg-[#659364]/5 dark:hover:bg-[#659364]/10 hover:shadow-md transition-all duration-200 cursor-pointer group animate-enter"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 text-xs font-bold text-foreground group-hover:scale-105 group-hover:border-[#659364]/50 transition-all duration-200 shadow-2xs">
                {favicon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={favicon}
                    alt={job.companyName}
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  getInitials(job.companyName)
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-foreground truncate group-hover:text-[#659364] dark:group-hover:text-[#8cb88b] transition-colors">
                  {job.jobTitle}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                  <span className="font-semibold text-foreground truncate">
                    {job.companyName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-primary" />
                    {formatDate(job.applicationDate)}
                  </span>
                </div>
              </div>
            </div>

            <div
              className="shrink-0 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <StatusBadge
                status={job.status}
                size="sm"
                onChange={
                  onStatusChange
                    ? (newStatus) => onStatusChange(job._id, newStatus)
                    : undefined
                }
              />
              <div className="hidden sm:flex items-center text-muted-foreground group-hover:text-[#659364] dark:group-hover:text-[#8cb88b] transition-colors">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
              </div>
            </div>
          </div>
        );
      })}

      <div className="pt-2 text-center">
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#659364] dark:text-[#8cb88b] hover:underline group"
        >
          <span>View all applications</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
