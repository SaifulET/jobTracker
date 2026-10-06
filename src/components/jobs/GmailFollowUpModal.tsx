"use client";

import React, { useState } from "react";
import { IJob, IFollowUp } from "@/types/job";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  formatDate,
  formatInputDate,
  generateGmailComposeUrl,
  getCompanyFaviconUrl,
  getInitials,
} from "@/lib/utils";
import {
  Mail,
  Send,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface GmailFollowUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: IJob | null;
  onJobUpdated?: (updatedJob: IJob) => void;
}

export function GmailFollowUpModal({
  open,
  onOpenChange,
  job,
  onJobUpdated,
}: GmailFollowUpModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [followUpDate, setFollowUpDate] = useState(formatInputDate(new Date()));
  const defaultSubject = job
    ? `Following up on ${job.jobTitle} application - Saiful Islam`
    : "Job Application Follow-Up";
  const defaultBody = job
    ? `Hi ${job.recruiterName || "Hiring Team"},\n\nI hope you're having a great week. I am following up on my application for the ${job.jobTitle} position at ${job.companyName}.\n\nI remain very enthusiastic about the opportunity to contribute to your team and would love to hear if there are any updates regarding the hiring timeline.\n\nBest regards,\nSaiful Islam\nExecutive Full-Stack Developer`
    : "";

  const [subject, setSubject] = useState(defaultSubject);
  const [content, setContent] = useState(defaultBody);
  const [note, setNote] = useState("");

  if (!job) return null;

  const followUps = (job.followUps || []).slice().sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleOpenGmailCompose = () => {
    if (!job.recruiterEmail) {
      toast.error("No recruiter email address provided for this job.");
      return;
    }

    const gmailUrl = generateGmailComposeUrl({
      to: job.recruiterEmail,
      subject: subject || defaultSubject,
      body: content || defaultBody,
    });

    window.open(gmailUrl, "_blank", "noopener,noreferrer");
    toast.success("Gmail compose window opened. Review and send your email!");
  };

  const handleMarkFollowedUp = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/jobs/${job._id}/followups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(),
          type: "Gmail",
          subject: subject || defaultSubject,
          content: content || defaultBody,
          note: note.trim() || "Follow-up email dispatched via Gmail compose.",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to log follow-up");
      }

      toast.success("Follow-up logged successfully!");
      setIsAdding(false);
      setNote("");
      if (onJobUpdated && data.job) {
        onJobUpdated(data.job);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to log follow-up";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualAddFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/jobs/${job._id}/followups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: followUpDate ? new Date(followUpDate) : new Date(),
          type: "Gmail",
          subject: subject.trim() || undefined,
          content: content.trim() || undefined,
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to log follow-up");
      }

      toast.success("Follow-up entry added successfully.");
      setIsAdding(false);
      setNote("");
      if (onJobUpdated && data.job) {
        onJobUpdated(data.job);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to log follow-up";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFollowUp = async (followupId?: string) => {
    if (!followupId) return;
    try {
      setDeletingId(followupId);
      const res = await fetch(`/api/jobs/${job._id}/followups/${followupId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete follow-up");
      }

      toast.success("Follow-up record removed.");
      if (onJobUpdated && data.job) {
        onJobUpdated(data.job);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to delete follow-up";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const favicon = getCompanyFaviconUrl(job.websiteLink, job.companyName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[88vh] flex flex-col p-0">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/60">
          <DialogHeader className="p-0 border-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-500/20 shrink-0">
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
                <div>
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    Gmail Follow-Up Tracker
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      {job.followUpCount} {job.followUpCount === 1 ? "Follow-Up" : "Follow-Ups"}
                    </span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    {job.jobTitle} • {job.companyName} ({job.recruiterEmail || "No email"})
                  </DialogDescription>
                </div>
              </div>

              {!isAdding && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsAdding(true)}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Follow-Up</span>
                </Button>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Gmail Compose & Dispatch Box */}
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-500 text-white shadow-xs">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Gmail Quick Follow-Up Action
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Opens Gmail with prefilled recipient, subject line, and polite follow-up message.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleOpenGmailCompose}
                  className="gap-1.5 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send in Gmail
                </Button>

                <Button
                  type="button"
                  variant="success"
                  size="sm"
                  onClick={handleMarkFollowedUp}
                  isLoading={isSubmitting}
                  className="gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark as Followed Up
                </Button>
              </div>
            </div>
          </div>

          {/* Collapsible Manual / Custom Follow Up Form */}
          {isAdding && (
            <form
              onSubmit={handleManualAddFollowUp}
              className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Log Follow-Up Record
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdding(false)}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Follow-Up Date
                  </label>
                  <Input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Channel / Type
                  </label>
                  <Input value="Gmail" disabled className="bg-muted" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Email Subject
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject line..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Email Content / Template
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  placeholder="Email body text..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Private Note / Recruiter Response
                </label>
                <Input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Recruiter replied mentioning next steps by Friday..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  isLoading={isSubmitting}
                >
                  Save Record
                </Button>
              </div>
            </form>
          )}

          {/* Follow Up History List */}
          {followUps.length === 0 && !isAdding ? (
            <div className="text-center py-10 px-4 border border-dashed border-border rounded-xl">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-3">
                <Mail className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                No follow-ups logged yet
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Send polite touchpoints and keep an audit trail of every email sent to recruiters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Follow-Up History ({followUps.length})
              </h4>
              {followUps.map((item, index) => (
                <div
                  key={item._id || index}
                  className="p-4 rounded-xl bg-card border border-border/70 shadow-xs hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        Follow-up #{followUps.length - index}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.date)}
                      </span>
                      <span className="text-xs text-muted-foreground">• Gmail</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteFollowUp(item._id)}
                      disabled={deletingId === item._id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-7 w-7"
                      title="Delete follow-up"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {item.subject && (
                    <p className="mt-2 text-xs font-semibold text-foreground">
                      Subject: {item.subject}
                    </p>
                  )}

                  {item.content && (
                    <p className="mt-1 text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                      {item.content}
                    </p>
                  )}

                  {item.note && (
                    <div className="mt-2 text-xs p-2 rounded-lg bg-muted/60 text-foreground font-medium flex items-start gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{item.note}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/60 flex items-center justify-between bg-muted/20">
          <span className="text-xs text-muted-foreground">
            Total Follow-Ups: <strong>{followUps.length}</strong>
          </span>
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
