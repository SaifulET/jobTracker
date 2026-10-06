"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { IJob, JobStatus } from "@/types/job";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { JobFormModal } from "@/components/jobs/JobFormModal";
import { UpdateTimelineModal } from "@/components/jobs/UpdateTimelineModal";
import { GmailFollowUpModal } from "@/components/jobs/GmailFollowUpModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  formatDate,
  formatDateTime,
  generateGmailComposeUrl,
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
  Edit2,
  Trash2,
  Send,
  Clock,
  ArrowLeft,
  Briefcase,
  Copy,
  Check,
  Plus,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<IJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const [isFollowUpsOpen, setIsFollowUpsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    try {
      setIsLoading(true);
      const res = await fetch(`/api/jobs/${jobId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setJob(data.data);
      } else {
        toast.error(data.message || "Job not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load job application details");
    } finally {
      setIsLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleStatusChange = async (newStatus: JobStatus) => {
    if (!job) return;
    try {
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setJob((prev) => (prev ? { ...prev, status: newStatus } : null));
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!job) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Job application deleted successfully.");
        router.push("/applications");
      }
    } catch {
      toast.error("Failed to delete application");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopyEmail = () => {
    if (!job?.recruiterEmail) return;
    navigator.clipboard.writeText(job.recruiterEmail);
    setCopiedEmail(true);
    toast.success("Email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (isLoading) {
    return (
      <AppLayout title="Job Details">
        <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
          Loading job details...
        </div>
      </AppLayout>
    );
  }

  if (!job) {
    return (
      <AppLayout title="Job Details">
        <div className="text-center py-16 px-4">
          <h3 className="text-lg font-bold">Job application not found</h3>
          <p className="text-xs text-muted-foreground mt-1">
            The requested application might have been deleted.
          </p>
          <Link href="/applications" className="mt-4 inline-block">
            <Button variant="default" size="sm">
              ← Return to Applications
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const favicon = getCompanyFaviconUrl(job.websiteLink, job.companyName);

  return (
    <AppLayout
      title={`${job.jobTitle} at ${job.companyName}`}
      subtitle="Complete job profile, recruiter records, interview updates, and Gmail tracking"
    >
      <div className="space-y-6">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Applications</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Hero Card Banner */}
        <div className="p-6 md:p-8 rounded-2xl bg-card border border-border/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0 text-lg font-bold text-foreground shadow-xs">
                {favicon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={favicon}
                    alt={job.companyName}
                    className="h-9 w-9 object-contain"
                  />
                ) : (
                  getInitials(job.companyName)
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {job.jobTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-primary" />
                    {job.companyName}
                  </span>
                  {job.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Applied {formatDate(job.applicationDate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge
                status={job.status}
                onChange={handleStatusChange}
                size="lg"
              />
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/40 border border-border/70 text-xs">
            <div>
              <span className="text-muted-foreground block mb-0.5">Recruiter / Contact</span>
              <span className="font-semibold text-foreground block truncate">
                {job.recruiterName || "Not specified"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block mb-0.5">Email Address</span>
              {job.recruiterEmail ? (
                <div className="flex items-center gap-1.5">
                  <a
                    href={`mailto:${job.recruiterEmail}`}
                    className="font-semibold text-primary hover:underline truncate"
                  >
                    {job.recruiterEmail}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 rounded text-muted-foreground hover:text-foreground"
                    title="Copy email"
                  >
                    {copiedEmail ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>

            <div>
              <span className="text-muted-foreground block mb-0.5">CV / Resume Used</span>
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

            <div>
              <span className="text-muted-foreground block mb-0.5">Job Website</span>
              {job.websiteLink ? (
                <a
                  href={job.websiteLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline flex items-center gap-1 truncate"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  <span>Visit Posting</span>
                </a>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Job Description & Personal Notes */}
          <div className="lg:col-span-7 space-y-6">
            {/* Short & Full Description */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Job Overview &amp; Responsibilities
              </h3>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-sm leading-relaxed text-foreground font-medium">
                {job.jobDescriptionShort}
              </div>

              {job.jobDescriptionFull ? (
                <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line pt-2">
                  {job.jobDescriptionFull}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No extended job description provided. Click &quot;Edit&quot; to add full responsibilities and qualifications.
                </p>
              )}
            </div>

            {/* Extra Notes */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Extra Notes &amp; Strategy
              </h3>

              {job.extraNote ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-foreground whitespace-pre-line font-medium leading-relaxed">
                  {job.extraNote}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No personal notes logged yet.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Updates & Follow-Ups */}
          <div className="lg:col-span-5 space-y-6">
            {/* Interview Updates Card */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    Interview Updates ({job.interviewUpdates?.length || 0})
                  </h3>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUpdatesOpen(true)}
                  className="h-8 text-xs font-semibold gap-1 text-purple-600 dark:text-purple-400 border-purple-500/30"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Manage
                </Button>
              </div>

              {(!job.interviewUpdates || job.interviewUpdates.length === 0) ? (
                <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No interview updates recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {job.interviewUpdates.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">
                          {formatDate(item.date)}
                        </span>
                        {item.title && (
                          <span className="font-semibold px-2 py-0.5 rounded bg-muted text-[11px]">
                            {item.title}
                          </span>
                        )}
                      </div>
                      <p className="text-foreground/90 whitespace-pre-line leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Gmail Follow-ups Card */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                    <Send className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    Gmail Follow-ups ({job.followUpCount || 0})
                  </h3>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFollowUpsOpen(true)}
                  className="h-8 text-xs font-semibold gap-1 text-amber-600 dark:text-amber-400 border-amber-500/30"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Manage
                </Button>
              </div>

              {(!job.followUps || job.followUps.length === 0) ? (
                <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No Gmail follow-up logs recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {job.followUps.map((item, idx) => (
                    <div
                      key={item._id || idx}
                      className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-600">
                          {formatDate(item.date)}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          Gmail
                        </span>
                      </div>
                      {item.subject && (
                        <p className="font-semibold text-foreground">
                          {item.subject}
                        </p>
                      )}
                      {item.content && (
                        <p className="text-muted-foreground line-clamp-2">
                          {item.content}
                        </p>
                      )}
                      {item.note && (
                        <div className="p-2 rounded bg-background text-foreground text-[11px] font-medium mt-1">
                          Note: {item.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <JobFormModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        job={job}
        onSuccess={(updated) => {
          setJob(updated);
          setIsEditOpen(false);
        }}
      />

      <UpdateTimelineModal
        open={isUpdatesOpen}
        onOpenChange={setIsUpdatesOpen}
        job={job}
        onJobUpdated={(updated) => {
          setJob(updated);
        }}
      />

      <GmailFollowUpModal
        open={isFollowUpsOpen}
        onOpenChange={setIsFollowUpsOpen}
        job={job}
        onJobUpdated={(updated) => {
          setJob(updated);
        }}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Job Application"
        description={`Are you sure you want to delete "${job.jobTitle}" at "${job.companyName}"?`}
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </AppLayout>
  );
}
