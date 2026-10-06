"use client";

import React, { useState } from "react";
import { IJob, JobStatus } from "@/types/job";
import { JobRow } from "@/components/jobs/JobRow";
import { JobCardMobile } from "@/components/jobs/JobCardMobile";
import { JobDescriptionModal } from "@/components/jobs/JobDescriptionModal";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { UpdateTimelineModal } from "@/components/jobs/UpdateTimelineModal";
import { GmailFollowUpModal } from "@/components/jobs/GmailFollowUpModal";
import { JobFormModal } from "@/components/jobs/JobFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Inbox, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface JobTableProps {
  jobs: IJob[];
  isLoading: boolean;
  page: number;
  limit: number;
  onRefresh: () => void;
  onOpenAddJob?: () => void;
}

export function JobTable({
  jobs,
  isLoading,
  page,
  limit,
  onRefresh,
  onOpenAddJob,
}: JobTableProps) {
  // Modal states
  const [selectedJobForDesc, setSelectedJobForDesc] = useState<IJob | null>(null);
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<IJob | null>(null);
  const [selectedJobForUpdates, setSelectedJobForUpdates] = useState<IJob | null>(null);
  const [selectedJobForFollowUps, setSelectedJobForFollowUps] = useState<IJob | null>(null);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState<IJob | null>(null);
  const [selectedJobForDelete, setSelectedJobForDelete] = useState<IJob | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status Change handler
  const handleStatusChange = async (jobId: string, newStatus: JobStatus) => {
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update status");
      }

      toast.success(`Status updated to ${newStatus}`);
      onRefresh();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update status";
      toast.error(msg);
    }
  };

  // Delete Job handler
  const handleConfirmDelete = async () => {
    if (!selectedJobForDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/jobs/${selectedJobForDelete._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete job");
      }

      toast.success("Job application deleted successfully.");
      setSelectedJobForDelete(null);
      onRefresh();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to delete job";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="hidden md:block rounded-xl border border-border/80 overflow-hidden bg-card p-4">
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <Skeleton className="h-6 w-8 rounded" />
                <Skeleton className="h-6 flex-1 rounded" />
                <Skeleton className="h-6 w-28 rounded" />
                <Skeleton className="h-6 w-28 rounded" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="md:hidden space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-card space-y-3">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/50 animate-scale-in">
        <div className="h-16 w-16 rounded-2xl bg-[#659364]/10 dark:bg-[#659364]/15 text-[#4e794d] dark:text-[#8cb88b] flex items-center justify-center mx-auto mb-4 border border-[#659364]/30 shadow-xs">
          <Inbox className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground">
          No job applications yet
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Start tracking your job applications by adding your first job.
        </p>
        {onOpenAddJob && (
          <Button
            onClick={onOpenAddJob}
            variant="default"
            className="mt-5 gap-2 font-semibold shadow-md interactive-button"
          >
            <Plus className="h-4 w-4" />
            <span>Add Job</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden animate-enter">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider select-none whitespace-nowrap">
                <th className="py-3 px-3 text-center w-12 whitespace-nowrap">#</th>
                <th className="py-3 px-4 min-w-[220px] whitespace-nowrap">Job Description</th>
                <th className="py-3 px-4 min-w-[140px] whitespace-nowrap">Company</th>
                <th className="py-3 px-4 min-w-[150px] whitespace-nowrap">Email</th>
                <th className="py-3 px-4 min-w-[130px] whitespace-nowrap">Location</th>
                <th className="py-3 px-4 min-w-[110px] whitespace-nowrap">CV</th>
                <th className="py-3 px-4 min-w-[145px] whitespace-nowrap">Update</th>
                <th className="py-3 px-4 min-w-[90px] whitespace-nowrap">Website</th>
                <th className="py-3 px-4 min-w-[145px] whitespace-nowrap">Status</th>
                <th className="py-3 px-4 min-w-[120px] whitespace-nowrap">Application Date</th>
                <th className="py-3 px-4 text-right min-w-[90px] whitespace-nowrap">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {jobs.map((job, idx) => {
                const globalIndex = (page - 1) * limit + idx + 1;
                return (
                  <JobRow
                    key={job._id}
                    job={job}
                    index={globalIndex}
                    onViewDescription={setSelectedJobForDesc}
                    onViewDetails={setSelectedJobForDetail}
                    onOpenUpdates={setSelectedJobForUpdates}
                    onOpenFollowUps={setSelectedJobForFollowUps}
                    onEdit={setSelectedJobForEdit}
                    onDelete={setSelectedJobForDelete}
                    onStatusChange={handleStatusChange}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {jobs.map((job, idx) => {
          const globalIndex = (page - 1) * limit + idx + 1;
          return (
            <JobCardMobile
              key={job._id}
              job={job}
              index={globalIndex}
              onViewDescription={setSelectedJobForDesc}
              onViewDetails={setSelectedJobForDetail}
              onOpenUpdates={setSelectedJobForUpdates}
              onOpenFollowUps={setSelectedJobForFollowUps}
              onEdit={setSelectedJobForEdit}
              onDelete={setSelectedJobForDelete}
              onStatusChange={handleStatusChange}
            />
          );
        })}
      </div>

      {/* Modals & Dialogs */}
      <JobDescriptionModal
        open={Boolean(selectedJobForDesc)}
        onOpenChange={(open) => !open && setSelectedJobForDesc(null)}
        job={selectedJobForDesc}
      />

      <JobDetailModal
        open={Boolean(selectedJobForDetail)}
        onOpenChange={(open) => !open && setSelectedJobForDetail(null)}
        job={selectedJobForDetail}
        onEdit={(job) => {
          setSelectedJobForDetail(null);
          setSelectedJobForEdit(job);
        }}
        onDelete={(job) => {
          setSelectedJobForDetail(null);
          setSelectedJobForDelete(job);
        }}
        onStatusChange={handleStatusChange}
        onOpenUpdates={(job) => {
          setSelectedJobForDetail(null);
          setSelectedJobForUpdates(job);
        }}
        onOpenFollowUps={(job) => {
          setSelectedJobForDetail(null);
          setSelectedJobForFollowUps(job);
        }}
      />

      <UpdateTimelineModal
        open={Boolean(selectedJobForUpdates)}
        onOpenChange={(open) => !open && setSelectedJobForUpdates(null)}
        job={selectedJobForUpdates}
        onJobUpdated={(updated) => {
          setSelectedJobForUpdates(updated);
          onRefresh();
        }}
      />

      <GmailFollowUpModal
        open={Boolean(selectedJobForFollowUps)}
        onOpenChange={(open) => !open && setSelectedJobForFollowUps(null)}
        job={selectedJobForFollowUps}
        onJobUpdated={(updated) => {
          setSelectedJobForFollowUps(updated);
          onRefresh();
        }}
      />

      <JobFormModal
        open={Boolean(selectedJobForEdit)}
        onOpenChange={(open) => !open && setSelectedJobForEdit(null)}
        job={selectedJobForEdit}
        onSuccess={() => {
          setSelectedJobForEdit(null);
          onRefresh();
        }}
      />

      <ConfirmDialog
        open={Boolean(selectedJobForDelete)}
        onOpenChange={(open) => !open && setSelectedJobForDelete(null)}
        title="Delete Job Application"
        description={`Are you sure you want to delete the application for "${selectedJobForDelete?.jobTitle}" at "${selectedJobForDelete?.companyName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
