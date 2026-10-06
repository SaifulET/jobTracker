"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, JobInput } from "@/lib/validations/job";
import { IJob, JobStatus, JOB_STATUSES } from "@/types/job";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatInputDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Briefcase,
  Building2,
  Mail,
  MapPin,
  FileText,
  Link as LinkIcon,
  Calendar,
  FileCode,
} from "lucide-react";

interface JobFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: IJob | null;
  onSuccess?: (job: IJob) => void;
}

export function JobFormModal({
  open,
  onOpenChange,
  job,
  onSuccess,
}: JobFormModalProps) {
  const isEditing = Boolean(job);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JobInput>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      recruiterName: "",
      recruiterEmail: "",
      location: "",
      jobDescriptionShort: "",
      jobDescriptionFull: "",
      cvLink: "",
      cvName: "",
      websiteLink: "",
      applicationDate: new Date(),
      status: "Saved",
      extraNote: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (job) {
        reset({
          jobTitle: job.jobTitle || "",
          companyName: job.companyName || "",
          recruiterName: job.recruiterName || "",
          recruiterEmail: job.recruiterEmail || "",
          location: job.location || "",
          jobDescriptionShort: job.jobDescriptionShort || "",
          jobDescriptionFull: job.jobDescriptionFull || "",
          cvLink: job.cvLink || "",
          cvName: job.cvName || "",
          websiteLink: job.websiteLink || "",
          applicationDate: job.applicationDate
            ? new Date(job.applicationDate)
            : new Date(),
          status: job.status || "Saved",
          extraNote: job.extraNote || "",
        });
      } else {
        reset({
          jobTitle: "",
          companyName: "",
          recruiterName: "",
          recruiterEmail: "",
          location: "",
          jobDescriptionShort: "",
          jobDescriptionFull: "",
          cvLink: "",
          cvName: "",
          websiteLink: "",
          applicationDate: new Date(),
          status: "Saved",
          extraNote: "",
        });
      }
    }
  }, [open, job, reset]);

  const onSubmit = async (data: JobInput) => {
    try {
      setIsSubmitting(true);
      const url = isEditing ? `/api/jobs/${job?._id}` : "/api/jobs";
      const method = isEditing ? "PATCH" : "POST";

      const toastId = toast.loading(isEditing ? "Updating..." : "Saving...");

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save job application");
      }

      toast.success(
        isEditing
          ? "Job application updated successfully."
          : "Job application added successfully.",
        { id: toastId }
      );

      onOpenChange(false);
      if (onSuccess) {
        onSuccess(json.data);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="max-h-[92vh] flex flex-col p-0">
        <div className="p-6 pb-4 border-b border-border/60 bg-muted/30">
          <DialogHeader className="p-0 border-none">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground">
                  {isEditing ? "Edit Job Application" : "Add New Job Application"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5 font-medium">
                  {isEditing
                    ? "Modify and refine details for this career opportunity."
                    : "Fill in the details to track a new job application in your pipeline."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-5"
        >
          {/* Primary Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                Job Title <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Senior Full Stack Developer"
                {...register("jobTitle")}
                error={errors.jobTitle?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                Company Name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Stripe, Google, Acme Corp"
                {...register("companyName")}
                error={errors.companyName?.message}
              />
            </div>
          </div>

          {/* Status & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Application Status
              </label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("status")}
              >
                {JOB_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-xs text-destructive">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Application Date
              </label>
              <Input
                type="date"
                defaultValue={formatInputDate(new Date())}
                onChange={(e) => {
                  setValue("applicationDate", e.target.value ? new Date(e.target.value) : new Date());
                }}
              />
            </div>
          </div>

          {/* Recruiter Details & Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Recruiter / Contact Name
              </label>
              <Input
                placeholder="e.g. Sarah Jenkins"
                {...register("recruiterName")}
                error={errors.recruiterName?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                Recruiter Email
              </label>
              <Input
                type="email"
                placeholder="recruiter@example.com"
                {...register("recruiterEmail")}
                error={errors.recruiterEmail?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Location
              </label>
              <Input
                placeholder="e.g. Remote, Dhaka, San Francisco"
                {...register("location")}
                error={errors.location?.message}
              />
            </div>
          </div>

          {/* Links: Website, CV */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5 text-primary" />
                Job / Company Website
              </label>
              <Input
                type="url"
                placeholder="https://company.com/careers/..."
                {...register("websiteLink")}
                error={errors.websiteLink?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-primary" />
                CV Link (Google Drive/Dropbox)
              </label>
              <Input
                type="url"
                placeholder="https://drive.google.com/..."
                {...register("cvLink")}
                error={errors.cvLink?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                CV Version / Name
              </label>
              <Input
                placeholder="e.g. Resume_FullStack_2026.pdf"
                {...register("cvName")}
                error={errors.cvName?.message}
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Short Job Description <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g. Build scalable web applications and high-throughput APIs using Next.js & Node.js..."
              {...register("jobDescriptionShort")}
              error={errors.jobDescriptionShort?.message}
            />
          </div>

          {/* Full Job Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Full Job Description (Optional)
            </label>
            <Textarea
              rows={4}
              placeholder="Paste the full job requirements, responsibilities, salary range, qualifications, tech stack..."
              {...register("jobDescriptionFull")}
              error={errors.jobDescriptionFull?.message}
            />
          </div>

          {/* Extra Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Extra Notes / Reminders (Multiline)
            </label>
            <Textarea
              rows={3}
              placeholder="e.g. Need to follow up after 3 business days. Expected salary: $... Recruiter emphasized system design experience."
              {...register("extraNote")}
              error={errors.extraNote?.message}
            />
          </div>

          <DialogFooter className="p-0 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              isLoading={isSubmitting}
              className="gap-2"
            >
              {isEditing ? "Update Application" : "Save Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
