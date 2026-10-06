"use client";

import React, { useState } from "react";
import { IJob, JobStatus } from "@/types/job";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import {
  formatDate,
  formatDateTime,
  getCompanyFaviconUrl,
  getInitials,
} from "@/lib/utils";
import {
  Building2,
  MapPin,
  Mail,
  Calendar,
  ExternalLink,
  FileCode,
  Edit,
  Trash2,
  Send,
  MessageSquare,
  Clock,
  Briefcase,
  CheckCircle2,
  Plus,
} from "lucide-react";

interface JobDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: IJob | null;
  onEdit?: (job: IJob) => void;
  onDelete?: (job: IJob) => void;
  onStatusChange?: (jobId: string, status: JobStatus) => Promise<void>;
  onOpenUpdates?: (job: IJob) => void;
  onOpenFollowUps?: (job: IJob) => void;
}

export function JobDetailModal({
  open,
  onOpenChange,
  job,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenUpdates,
  onOpenFollowUps,
}: JobDetailModalProps) {
  if (!job) return null;

  const favicon = getCompanyFaviconUrl(job.websiteLink, job.companyName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[88vh] flex flex-col p-0">
        {/* Header Banner */}
        <div className="p-6 pb-4 border-b border-border bg-muted/40">
          <DialogHeader className="p-0 border-none">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                  {favicon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={favicon}
                      alt={job.companyName}
                      className="h-7 w-7 object-contain"
                    />
                  ) : (
                    <span className="font-bold text-sm">
                      {getInitials(job.companyName)}
                    </span>
                  )}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight">
                    {job.jobTitle}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                      {job.companyName}
                    </span>
                    {job.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge with inline dropdown */}
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={job.status}
                  onChange={
                    onStatusChange
                      ? (newStatus) => onStatusChange(job._id, newStatus)
                      : undefined
                  }
                />
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/40 border border-border/60 text-xs">
            <div>
              <span className="text-muted-foreground block mb-0.5">Applied Date</span>
              <span className="font-semibold flex items-center gap-1 text-foreground">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {formatDate(job.applicationDate)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Recruiter</span>
              <span className="font-semibold text-foreground truncate block">
                {job.recruiterName || "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Email</span>
              {job.recruiterEmail ? (
                <a
                  href={`mailto:${job.recruiterEmail}`}
                  className="font-semibold text-primary hover:underline flex items-center gap-1 truncate"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{job.recruiterEmail}</span>
                </a>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">CV Attached</span>
              {job.cvLink ? (
                <a
                  href={job.cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline flex items-center gap-1 truncate"
                >
                  <FileCode className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{job.cvName || "View CV"}</span>
                </a>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {job.websiteLink && (
              <a
                href={job.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input bg-card text-xs font-medium hover:bg-muted transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-primary" />
                Website Link
              </a>
            )}

            {onOpenUpdates && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenUpdates(job)}
                className="gap-1.5 text-xs h-8"
              >
                <Clock className="h-3.5 w-3.5 text-purple-500" />
                Updates ({job.interviewUpdates?.length || 0})
              </Button>
            )}

            {onOpenFollowUps && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenFollowUps(job)}
                className="gap-1.5 text-xs h-8"
              >
                <Send className="h-3.5 w-3.5 text-amber-500" />
                Gmail Follow-ups ({job.followUpCount || 0})
              </Button>
            )}
          </div>

          {/* Job Description Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Role Summary
            </h4>
            <div className="p-4 rounded-xl bg-card border border-border/80 text-sm leading-relaxed text-foreground font-medium">
              {job.jobDescriptionShort}
            </div>
          </div>

          {/* Full Job Description */}
          {job.jobDescriptionFull && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Full Job Description
              </h4>
              <div className="p-4 rounded-xl bg-card border border-border/80 text-sm leading-relaxed text-muted-foreground whitespace-pre-line font-normal">
                {job.jobDescriptionFull}
              </div>
            </div>
          )}

          {/* Extra Notes */}
          {job.extraNote && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Extra Notes &amp; Strategy
              </h4>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-foreground whitespace-pre-line">
                {job.extraNote}
              </div>
            </div>
          )}

          {/* Recent Interview Updates Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Interview Updates ({job.interviewUpdates?.length || 0})
              </h4>
              {onOpenUpdates && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenUpdates(job)}
                  className="h-7 text-xs text-primary gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Manage Updates
                </Button>
              )}
            </div>

            {(!job.interviewUpdates || job.interviewUpdates.length === 0) ? (
              <p className="text-xs text-muted-foreground italic p-3 rounded-lg border border-dashed border-border text-center">
                No interview rounds recorded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {job.interviewUpdates.slice(0, 3).map((up, i) => (
                  <div
                    key={up._id || i}
                    className="p-3 rounded-lg bg-card border border-border/70 text-xs flex items-start justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">
                          {formatDate(up.date)}
                        </span>
                        {up.title && (
                          <span className="font-semibold px-1.5 py-0.5 rounded bg-muted text-[11px]">
                            {up.title}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-muted-foreground">{up.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/60 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2">
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(job)}
                className="gap-1.5 h-8 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(job)}
                className="gap-1.5 h-8 text-xs"
              >
                <Edit className="h-3.5 w-3.5" />
                Edit Details
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
