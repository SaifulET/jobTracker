"use client";

import React, { useState } from "react";
import { IJob, IInterviewUpdate } from "@/types/job";
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
import { formatDate, formatInputDate, getCompanyFaviconUrl, getInitials } from "@/lib/utils";
import {
  Calendar,
  Plus,
  Trash2,
  Clock,
  Briefcase,
  CheckCircle2,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";

interface UpdateTimelineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: IJob | null;
  onJobUpdated?: (updatedJob: IJob) => void;
}

export function UpdateTimelineModal({
  open,
  onOpenChange,
  job,
  onJobUpdated,
}: UpdateTimelineModalProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [updateDate, setUpdateDate] = useState(formatInputDate(new Date()));
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");

  if (!job) return null;

  const updates = (job.interviewUpdates || []).slice().sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateContent.trim()) {
      toast.error("Please enter update content");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/jobs/${job._id}/updates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: updateDate ? new Date(updateDate) : new Date(),
          title: updateTitle.trim() || undefined,
          content: updateContent.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add update");
      }

      toast.success("Interview update added successfully.");
      setUpdateTitle("");
      setUpdateContent("");
      setIsAdding(false);
      if (onJobUpdated && data.job) {
        onJobUpdated(data.job);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to add update";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUpdate = async (updateId?: string) => {
    if (!updateId) return;
    try {
      setDeletingId(updateId);
      const res = await fetch(`/api/jobs/${job._id}/updates/${updateId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete update");
      }

      toast.success("Update deleted successfully.");
      if (onJobUpdated && data.job) {
        onJobUpdated(data.job);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to delete update";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const favicon = getCompanyFaviconUrl(job.websiteLink, job.companyName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[85vh] flex flex-col p-0">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/60">
          <DialogHeader className="p-0 border-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-500/20 shrink-0">
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
                  <DialogTitle className="text-lg font-bold">
                    Interview &amp; Application Updates
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    {job.jobTitle} • <span className="font-semibold text-foreground">{job.companyName}</span>
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
                  <span>Add Update</span>
                </Button>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add Update Form (Collapsible) */}
          {isAdding && (
            <form
              onSubmit={handleAddUpdate}
              className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-4 animate-in fade-in zoom-in-95"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarCheck className="h-4 w-4" />
                  New Interview / Process Update
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
                    Date of Update
                  </label>
                  <Input
                    type="date"
                    value={updateDate}
                    onChange={(e) => setUpdateDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">
                    Title / Round (Optional)
                  </label>
                  <Input
                    placeholder="e.g. Technical Round 1, Recruiter Call"
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">
                  Update Description / Notes <span className="text-destructive">*</span>
                </label>
                <Textarea
                  placeholder="e.g. Completed 60-min coding exercise on React and algorithm optimizations. Good feedback on system design."
                  value={updateContent}
                  onChange={(e) => setUpdateContent(e.target.value)}
                  rows={3}
                  required
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
                  Save Update
                </Button>
              </div>
            </form>
          )}

          {/* Updates Timeline List */}
          {updates.length === 0 && !isAdding ? (
            <div className="text-center py-10 px-4 border border-dashed border-border rounded-xl">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-3">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                No interview updates logged yet
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Record your recruiter screens, technical assessments, pairing sessions, and offer discussions here.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
                className="mt-4 gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                Add First Update
              </Button>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {updates.map((item, index) => (
                <div key={item._id || index} className="relative group">
                  {/* Timeline Node Dot */}
                  <div className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border/70 shadow-xs transition-shadow hover:shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.date)}
                          </span>
                          {item.title && (
                            <span className="text-xs font-semibold text-foreground px-2 py-0.5 rounded-md bg-muted">
                              {item.title}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteUpdate(item._id)}
                        disabled={deletingId === item._id}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive h-7 w-7"
                        title="Delete this update"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <p className="mt-2 text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/60 flex items-center justify-between bg-muted/20">
          <span className="text-xs text-muted-foreground">
            Total Updates: <strong>{updates.length}</strong>
          </span>
          <Button
            variant="default"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
