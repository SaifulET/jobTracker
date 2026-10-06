"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { IProfile } from "@/types/profile";
import { User, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/profile");
        const json = await res.json();
        if (json.success && json.data) {
          setProfile(json.data);
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (err) {
        console.error("Profile load error:", err);
        toast.error("Error fetching profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  return (
    <AppLayout
      title="Candidate Profile & Settings"
      subtitle="Manage your personal career identity, master resume link, portfolio, and contact info"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Personal Job-Search Profile
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            This profile configures your default recruiter communication data and master CV links.
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
            Loading profile information...
          </div>
        ) : (
          <ProfileForm
            initialProfile={profile}
            onProfileUpdated={(updated) => setProfile(updated)}
          />
        )}
      </div>
    </AppLayout>
  );
}
