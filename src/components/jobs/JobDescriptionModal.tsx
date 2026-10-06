"use client";

import React, { useState } from "react";
import { IJob } from "@/types/job";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatDate, getCompanyFaviconUrl, getInitials } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Mail,
  Calendar,
  ExternalLink,
  Copy,
  Check,
  FileText,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";

interface JobDescriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: IJob | null;
}

export function JobDescriptionModal({
  open,
  onOpenChange,
  job,
}: JobDescriptionModalProps) {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const favicon = getCompanyFaviconUrl(job.websiteLink, job.companyName);

  const handleCopy = () => {
    const textToCopy = `${job.jobTitle} at ${job.companyName}\n\nSummary:\n${job.jobDescriptionShort}\n\nFull Description:\n${job.jobDescriptionFull || "N/A"}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Job description copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[85vh] flex flex-col p-0">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/60">
          <DialogHeader className="p-0 border-none">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-muted/80 border border-border flex items-center justify-center overflow-hidden shrink-0">
                  {favicon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={favicon}
                      alt={job.companyName}
                      className="h-7 w-7 object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="font-bold text-sm text-foreground">
                      {getInitials(job.companyName)}
                    </span>
                  )}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold tracking-tight">
                    {job.jobTitle}
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
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

              <div className="shrink-0 flex items-center gap-2">
                <StatusBadge status={job.status} interactive={false} />
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs">
            <div>
              <span className="text-muted-foreground block mb-0.5">Applied Date</span>
              <span className="font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {formatDate(job.applicationDate)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Recruiter</span>
              <span className="font-medium truncate block">
                {job.recruiterName || "Not specified"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">Email</span>
              {job.recruiterEmail ? (
                <a
                  href={`mailto:${job.recruiterEmail}`}
                  className="font-medium text-primary hover:underline flex items-center gap-1 truncate"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{job.recruiterEmail}</span>
                </a>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
            <div>
              <span className="text-muted-foreground block mb-0.5">CV Used</span>
              {job.cvLink ? (
                <a
                  href={job.cvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline flex items-center gap-1 truncate"
                >
                  <FileCode className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{job.cvName || "View CV"}</span>
                </a>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </div>

          {/* Short Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" />
                Summary
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/80 text-sm leading-relaxed text-foreground font-medium">
              {job.jobDescriptionShort}
            </div>
          </div>

          {/* Full Description */}
          {job.jobDescriptionFull && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Full Description &amp; Responsibilities
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
                Personal Notes &amp; Strategy
              </h4>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-foreground whitespace-pre-line">
                {job.extraNote}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/60 flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2">
            {job.websiteLink && (
              <a
                href={job.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Visit Job Posting
              </a>
            )}
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
