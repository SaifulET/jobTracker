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
  Eye,
  Send,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

interface JobRowProps {
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

export function JobRow({
  job,
  index,
  onViewDescription,
  onViewDetails,
  onOpenUpdates,
  onOpenFollowUps,
  onEdit,
  onDelete,
  onStatusChange,
}: JobRowProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const favicon = getCompanyFaviconUrl(job.websiteLink, job.companyName);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job.recruiterEmail) return;
    navigator.clipboard.writeText(job.recruiterEmail);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <tr
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
      className="border-b border-border/60 hover:bg-[#659364]/5 dark:hover:bg-[#659364]/10 transition-all duration-200 group/row text-sm animate-enter"
    >
      {/* 1. Index # */}
      <td className="py-3.5 px-3 text-xs font-mono font-bold text-muted-foreground w-12 text-center whitespace-nowrap group-hover/row:text-[#659364] group-hover/row:font-extrabold transition-colors">
        {index}
      </td>

      {/* 2. Job Description Column */}
      <td className="py-3.5 px-4 min-w-[220px] max-w-[280px]">
        <div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onViewDetails(job)}
              className="font-bold text-foreground hover:text-[#659364] dark:hover:text-[#8cb88b] transition-colors text-left truncate block"
              title={job.jobTitle}
            >
              {job.jobTitle}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-muted-foreground line-clamp-1 truncate flex-1 font-normal">
              {job.jobDescriptionShort}
            </p>
            <button
              onClick={() => onViewDescription(job)}
              className="text-[11px] font-bold text-[#4e794d] dark:text-[#8cb88b] hover:bg-[#659364]/20 shrink-0 px-2 py-0.5 rounded-md bg-[#659364]/10 dark:bg-[#659364]/20 border border-[#659364]/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-2xs"
              title="View full description"
            >
              View
            </button>
          </div>
        </div>
      </td>

      {/* 3. Company Column */}
      <td className="py-3.5 px-4 min-w-[140px] whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 text-xs font-bold text-foreground group-hover/row:scale-110 transition-transform duration-200 shadow-2xs">
            {favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={favicon}
                alt={job.companyName}
                className="h-4 w-4 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              getInitials(job.companyName)
            )}
          </div>
          <span className="font-semibold text-foreground truncate max-w-[130px]" title={job.companyName}>
            {job.companyName}
          </span>
        </div>
      </td>

      {/* 4. Email Column */}
      <td className="py-3.5 px-4 min-w-[150px] whitespace-nowrap">
        {job.recruiterEmail ? (
          <div className="flex items-center gap-1.5 text-xs">
            <a
              href={`mailto:${job.recruiterEmail}`}
              className="text-[#4e794d] dark:text-[#8cb88b] hover:underline font-semibold truncate max-w-[120px]"
              title={job.recruiterEmail}
            >
              {job.recruiterEmail}
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 transition-all hover:scale-110 active:scale-95"
              title="Copy email"
            >
              {copiedEmail ? (
                <Check className="h-3.5 w-3.5 text-emerald-500 animate-in zoom-in-50" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </td>

      {/* 5. Location Column */}
      <td className="py-3.5 px-4 min-w-[130px] whitespace-nowrap">
        {job.location ? (
          <span className="text-xs font-medium text-muted-foreground truncate block max-w-[130px]" title={job.location}>
            {job.location}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </td>

      {/* 6. CV Column */}
      <td className="py-3.5 px-4 min-w-[110px] whitespace-nowrap">
        {job.cvLink ? (
          <a
            href={job.cvLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-[#4e794d] dark:text-[#8cb88b] hover:bg-[#659364]/20 px-2.5 py-1 rounded-lg bg-[#659364]/10 dark:bg-[#659364]/20 border border-[#659364]/30 shadow-2xs transition-all hover:scale-105 active:scale-95 shrink-0"
            title={job.cvName || "View CV"}
          >
            <FileCode className="h-3.5 w-3.5 shrink-0 text-[#659364] dark:text-[#8cb88b]" />
            <span className="whitespace-nowrap">{job.cvName ? "CV Link" : "View CV"}</span>
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </td>

      {/* 7. Update Column */}
      <td className="py-3.5 px-4 min-w-[145px] whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenUpdates(job)}
            className="h-7 px-2.5 text-xs font-bold gap-1.5 rounded-lg border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shadow-2xs"
          >
            <Clock className="h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
            <span className="whitespace-nowrap">Updates ({job.interviewUpdates?.length || 0})</span>
          </Button>

          {job.followUpCount > 0 && (
            <button
              onClick={() => onOpenFollowUps(job)}
              className="h-6 px-2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-[11px] font-bold hover:bg-amber-200 dark:hover:bg-amber-900 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0 shadow-2xs flex items-center gap-1"
              title={`${job.followUpCount} Gmail follow-up(s) logged`}
            >
              <Mail className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              <span>{job.followUpCount}</span>
            </button>
          )}
        </div>
      </td>

      {/* 8. Website Column */}
      <td className="py-3.5 px-4 min-w-[90px] whitespace-nowrap">
        {job.websiteLink ? (
          <a
            href={job.websiteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-0.5 whitespace-nowrap"
            title="Open job website"
          >
            <span className="whitespace-nowrap">Visit</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        )}
      </td>

      {/* 9. Status Column */}
      <td className="py-3.5 px-4 min-w-[145px] whitespace-nowrap">
        <StatusBadge
          status={job.status}
          onChange={(newStatus) => onStatusChange(job._id, newStatus)}
        />
      </td>

      {/* 10. Application Date */}
      <td className="py-3.5 px-4 min-w-[120px] text-xs font-medium text-muted-foreground whitespace-nowrap">
        {formatDate(job.applicationDate)}
      </td>

      {/* 11. Actions (Edit / Delete) */}
      <td className="py-3.5 px-4 text-right min-w-[90px] whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(job)}
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all hover:scale-110 active:scale-95"
            title="Edit Application"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(job)}
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-all hover:scale-110 active:scale-95"
            title="Delete Application"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
