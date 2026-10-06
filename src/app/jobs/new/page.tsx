"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema, JobInput } from "@/lib/validations/job";
import { JOB_STATUSES } from "@/types/job";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { formatInputDate } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  Mail,
  MapPin,
  FileText,
  Link as LinkIcon,
  Calendar,
  FileCode,
  ArrowLeft,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
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

  const onSubmit = async (data: JobInput) => {
    try {
      setIsSubmitting(true);
      const toastId = toast.loading("Adding job application...");

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to create job");
      }

      toast.success("Job application added successfully.", { id: toastId });
      router.push("/applications");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout
      title="Add New Job Application"
      subtitle="Track a new career opportunity in your pipeline"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Applications</span>
        </Link>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 md:p-8 rounded-2xl bg-card border border-border/80 shadow-sm space-y-6"
        >
          <div className="border-b border-border/60 pb-4">
            <h2 className="text-xl font-bold text-foreground">
              New Application Details
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fill in the company, recruiter, job description, and CV details.
            </p>
          </div>

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
                Initial Status
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
                Recruiter Name
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
                Company / Job Website
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
                CV Link
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
              Extra Notes / Reminders
            </label>
            <Textarea
              rows={3}
              placeholder="e.g. Need to follow up after 3 business days. Expected salary: $... Recruiter emphasized system design experience."
              {...register("extraNote")}
              error={errors.extraNote?.message}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/applications")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              isLoading={isSubmitting}
              className="gap-2 font-semibold"
            >
              <Save className="h-4 w-4" />
              Save Job Application
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
