"use client";

import React, { useState } from "react";
import { IJob, JobStatus } from "@/types/job";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import {
  formatDate,
  getCompanyFaviconUrl,
  getInitials,
} from "@/lib/utils";
import {
  Building2,
  Mail,
  MapPin,
  ExternalLink,
  FileCode,
  Edit2,
  Trash2,
  Copy,
  Check,
  Clock,
  Send,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface JobCardMobileProps {
  job: IJob;
  index: number;
  onViewDescription: (job: IJob) => void;
  onViewDetails: (job: IJob) => void;
  onOpenUpdates: (job: IJob) => void;
  onOpenFollowUps: (job: IJob) => void;
  onEdit: (job: IJob) => void;
  onDelete: (job: IJob) => void;
  onStatusChange: (jobId: string, newStatus: JobStatus) => Promise<void>;
}

export function JobCardMobile({
  job,
  index,
  onViewDescription,
  onViewDetails,
  onOpenUpdates,
  onOpenFollowUps,
  onEdit,
  onDelete,
  onStatusChange,
}: JobCardMobileProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const favicon = getCompanyFaviconUrl(job.websiteLink, job.companyName);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job.recruiterEmail) return;
    navigator.clipboard.writeText(job.recruiterEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div
      style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
      className="p-4 rounded-xl bg-card border-2 border-border/70 shadow-xs hover:shadow-md hover:border-[#659364]/60 transition-all duration-250 space-y-3 animate-enter"
    >
      {/* Header: Company, Favicon, Index, Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 text-xs font-bold text-foreground shadow-2xs">
            {favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={favicon}
                alt={job.companyName}
                className="h-6 w-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              getInitials(job.companyName)
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-1.5 py-0.2 rounded-md bg-muted text-[10px] font-mono font-bold text-muted-foreground">
                #{index}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {job.companyName}
              </span>
            </div>
            <button
              onClick={() => onViewDetails(job)}
              className="text-sm font-bold text-foreground hover:text-[#659364] dark:hover:text-[#8cb88b] transition-colors text-left"
            >
              {job.jobTitle}
            </button>
          </div>
        </div>

        <StatusBadge
          status={job.status}
          onChange={(newStatus) => onStatusChange(job._id, newStatus)}
          size="sm"
        />
      </div>

      {/* Description Snippet */}
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {job.jobDescriptionShort}
      </p>

      {/* Metadata Badges & Links */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {job.location && (
          <span className="inline-flex items-center gap-1 font-medium text-muted-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/50">
            <MapPin className="h-3 w-3 text-primary" />
            {job.location}
          </span>
        )}

        <span className="inline-flex items-center gap-1 font-medium text-muted-foreground px-2 py-0.5 rounded-md bg-muted/60 border border-border/50">
          <Calendar className="h-3 w-3" />
          {formatDate(job.applicationDate)}
        </span>

        {job.cvLink && (
          <a
            href={job.cvLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#4e794d] dark:text-[#8cb88b] font-bold px-2 py-0.5 rounded-md bg-[#659364]/10 dark:bg-[#659364]/20 border border-[#659364]/30 shadow-2xs hover:scale-105 active:scale-95 transition-all"
          >
            <FileCode className="h-3 w-3 text-[#659364] dark:text-[#8cb88b]" />
            CV Link
          </a>
        )}

        {job.websiteLink && (
          <a
            href={job.websiteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-[#659364] px-2 py-0.5 rounded-md bg-muted/60 border border-border/50 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Website
          </a>
        )}
      </div>

      {/* Recruiter Email */}
      {job.recruiterEmail && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#659364]/10 dark:bg-[#659364]/15 border border-[#659364]/30 text-xs">
          <a
            href={`mailto:${job.recruiterEmail}`}
            className="text-[#4e794d] dark:text-[#8cb88b] hover:underline font-bold truncate"
          >
            <Mail className="h-3.5 w-3.5 inline mr-1 text-[#659364] dark:text-[#8cb88b]" />
            {job.recruiterEmail}
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="p-1 text-muted-foreground hover:text-foreground hover:scale-110 active:scale-95 transition-all"
          >
            {copiedEmail ? (
              <Check className="h-3.5 w-3.5 text-emerald-500 animate-in zoom-in-50" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      )}

      {/* Actions Toolbar */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenUpdates(job)}
            className="h-7 px-2 text-xs font-bold gap-1 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900"
          >
            <Clock className="h-3 w-3 text-purple-600" />
            Updates ({job.interviewUpdates?.length || 0})
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenFollowUps(job)}
            className="h-7 px-2 text-xs font-bold gap-1 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900"
          >
            <Send className="h-3 w-3 text-amber-600" />
            Follow-ups ({job.followUpCount || 0})
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(job)}
            className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all hover:scale-110 active:scale-95"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(job)}
            className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-all hover:scale-110 active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
