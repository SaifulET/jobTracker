"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileInput } from "@/lib/validations/profile";
import { IProfile } from "@/types/profile";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Globe,
  FileCode,
  Briefcase,
  Save,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

interface ProfileFormProps {
  initialProfile: IProfile | null;
  onProfileUpdated?: (profile: IProfile) => void;
}

export function ProfileForm({
  initialProfile,
  onProfileUpdated,
}: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<IProfile | null>(initialProfile);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialProfile?.fullName || "",
      professionalTitle: initialProfile?.professionalTitle || "",
      email: initialProfile?.email || "",
      phone: initialProfile?.phone || "",
      location: initialProfile?.location || "",
      github: initialProfile?.github || "",
      linkedin: initialProfile?.linkedin || "",
      portfolio: initialProfile?.portfolio || "",
      defaultCv: initialProfile?.defaultCv || "",
      defaultCvName: initialProfile?.defaultCvName || "",
      bio: initialProfile?.bio || "",
    },
  });

  useEffect(() => {
    if (initialProfile) {
      setProfileData(initialProfile);
      reset({
        fullName: initialProfile.fullName || "",
        professionalTitle: initialProfile.professionalTitle || "",
        email: initialProfile.email || "",
        phone: initialProfile.phone || "",
        location: initialProfile.location || "",
        github: initialProfile.github || "",
        linkedin: initialProfile.linkedin || "",
        portfolio: initialProfile.portfolio || "",
        defaultCv: initialProfile.defaultCv || "",
        defaultCvName: initialProfile.defaultCvName || "",
        bio: initialProfile.bio || "",
      });
    }
  }, [initialProfile, reset]);

  const watchedValues = watch();

  const onSubmit = async (data: ProfileInput) => {
    try {
      setIsSubmitting(true);
      const toastId = toast.loading("Saving profile updates...");

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update profile");
      }

      toast.success("Profile saved successfully.", { id: toastId });
      setProfileData(json.data);
      if (onProfileUpdated) {
        onProfileUpdated(json.data);
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Live Profile Card / Portfolio Banner */}
      <div className="lg:col-span-1 space-y-6 animate-enter stagger-1">
        <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm relative overflow-hidden">
          {/* Background Solid Banner */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-[#659364]" />

          {/* Avatar & Header */}
          <div className="relative pt-6 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center font-bold text-2xl text-primary mb-3">
              {getInitials(watchedValues.fullName || "User")}
            </div>

            <h3 className="text-lg font-bold text-foreground">
              {watchedValues.fullName || "Your Full Name"}
            </h3>
            <p className="text-xs font-semibold text-primary mt-0.5">
              {watchedValues.professionalTitle || "Professional Title"}
            </p>

            {watchedValues.location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {watchedValues.location}
              </p>
            )}
          </div>

          {/* Bio Snippet */}
          {watchedValues.bio && (
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed text-center italic border-t border-border/60 pt-3">
              &quot;{watchedValues.bio}&quot;
            </p>
          )}

          {/* Direct Social & Portfolio Links */}
          <div className="mt-5 space-y-2 pt-4 border-t border-border/60">
            {watchedValues.portfolio && (
              <a
                href={watchedValues.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 border border-border/70 text-xs font-semibold text-foreground hover:border-[#659364]/50 shadow-2xs hover:shadow-xs transition-all duration-200 group/link"
              >
                <span className="flex items-center gap-2.5 truncate">
                  <div className="h-7 w-7 rounded-lg bg-[#659364]/10 text-[#4e794d] dark:text-[#8cb88b] flex items-center justify-center shrink-0 border border-[#659364]/20">
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">Portfolio Website</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover/link:text-foreground transition-colors shrink-0" />
              </a>
            )}

            {watchedValues.defaultCv && (
              <a
                href={watchedValues.defaultCv}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 border border-border/70 text-xs font-semibold text-foreground hover:border-purple-500/50 shadow-2xs hover:shadow-xs transition-all duration-200 group/link"
              >
                <span className="flex items-center gap-2.5 truncate">
                  <div className="h-7 w-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                    <FileCode className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">
                    {watchedValues.defaultCvName || "Master Resume / CV"}
                  </span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover/link:text-foreground transition-colors shrink-0" />
              </a>
            )}

            {watchedValues.github && (
              <a
                href={watchedValues.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 border border-border/70 text-xs font-semibold text-foreground hover:border-slate-500/50 shadow-2xs hover:shadow-xs transition-all duration-200 group/link"
              >
                <span className="flex items-center gap-2.5 truncate">
                  <div className="h-7 w-7 rounded-lg bg-slate-500/10 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 border border-slate-500/20">
                    <Github className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">GitHub Profile</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover/link:text-foreground transition-colors shrink-0" />
              </a>
            )}

            {watchedValues.linkedin && (
              <a
                href={watchedValues.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 hover:bg-muted/80 border border-border/70 text-xs font-semibold text-foreground hover:border-sky-500/50 shadow-2xs hover:shadow-xs transition-all duration-200 group/link"
              >
                <span className="flex items-center gap-2.5 truncate">
                  <div className="h-7 w-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
                    <Linkedin className="h-3.5 w-3.5" />
                  </div>
                  <span className="truncate">LinkedIn Profile</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover/link:text-foreground transition-colors shrink-0" />
              </a>
            )}
          </div>
        </div>

        {/* Gmail & Follow-up Helper Card */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>Personal Gmail Integration</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Your personal profile email (<strong>{watchedValues.email || "saiful.dev@example.com"}</strong>) is used to generate personalized follow-up email templates for recruiters.
          </p>
        </div>
      </div>

      {/* Right Column: Editable Form */}
      <div className="lg:col-span-2 animate-enter stagger-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 md:p-8 rounded-2xl bg-card border border-border/80 shadow-sm space-y-6"
        >
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Candidate Profile Information
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your personal contact details, portfolio links, and master resume.
            </p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Saiful Islam"
                {...register("fullName")}
                error={errors.fullName?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                Professional Title <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="e.g. Executive Full-Stack Developer"
                {...register("professionalTitle")}
                error={errors.professionalTitle?.message}
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-primary" />
                Personal Gmail <span className="text-destructive">*</span>
              </label>
              <Input
                type="email"
                placeholder="myemail@gmail.com"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" />
                Phone Number
              </label>
              <Input
                placeholder="+880 1700 000000"
                {...register("phone")}
                error={errors.phone?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Location
              </label>
              <Input
                placeholder="Dhaka, Bangladesh"
                {...register("location")}
                error={errors.location?.message}
              />
            </div>
          </div>

          {/* Web & Social Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-primary" />
                Portfolio Website
              </label>
              <Input
                type="url"
                placeholder="https://saiful.dev"
                {...register("portfolio")}
                error={errors.portfolio?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Github className="h-3.5 w-3.5 text-primary" />
                GitHub Profile URL
              </label>
              <Input
                type="url"
                placeholder="https://github.com/saiful"
                {...register("github")}
                error={errors.github?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Linkedin className="h-3.5 w-3.5 text-primary" />
                LinkedIn Profile URL
              </label>
              <Input
                type="url"
                placeholder="https://linkedin.com/in/saiful"
                {...register("linkedin")}
                error={errors.linkedin?.message}
              />
            </div>
          </div>

          {/* Master Resume / CV Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-primary" />
                Master CV / Resume Link
              </label>
              <Input
                type="url"
                placeholder="https://drive.google.com/file/d/.../view"
                {...register("defaultCv")}
                error={errors.defaultCv?.message}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                CV Label / Filename
              </label>
              <Input
                placeholder="e.g. Saiful_Islam_Resume_FullStack.pdf"
                {...register("defaultCvName")}
                error={errors.defaultCvName?.message}
              />
            </div>
          </div>

          {/* Short Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Professional Bio &amp; Summary
            </label>
            <Textarea
              rows={4}
              placeholder="Write a concise overview of your background, years of experience, core tech stack, and what you're looking for..."
              {...register("bio")}
              error={errors.bio?.message}
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {isDirty ? (
                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  Unsaved changes
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  All changes saved
                </span>
              )}
            </p>

            <Button
              type="submit"
              variant="default"
              isLoading={isSubmitting}
              className="gap-2 font-bold shadow-md bg-[#659364] hover:bg-[#547c53] text-white rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              <Save className="h-4 w-4" />
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
