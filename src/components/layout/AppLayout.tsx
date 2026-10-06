"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { JobFormModal } from "@/components/jobs/JobFormModal";
import { X } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onJobCreated?: () => void;
}

export function AppLayout({
  children,
  title,
  subtitle,
  onJobCreated,
}: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  const handleJobCreated = () => {
    setIsAddJobOpen(false);
    if (onJobCreated) {
      onJobCreated();
    }
    // Also dispatch custom event for page listeners
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("job-updated"));
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 z-30 h-screen">
        <Sidebar onOpenAddJob={() => setIsAddJobOpen(true)} className="h-full w-64" />
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85vw] bg-card h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground rounded-lg"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar
              onOpenAddJob={() => {
                setMobileMenuOpen(false);
                setIsAddJobOpen(true);
              }}
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area (Offset by fixed sidebar width on desktop) */}
      <div className="md:pl-64 flex flex-col min-h-screen min-w-0">
        <Navbar
          title={title}
          subtitle={subtitle}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAddJob={() => setIsAddJobOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Add Job Modal */}
      <JobFormModal
        open={isAddJobOpen}
        onOpenChange={setIsAddJobOpen}
        onSuccess={handleJobCreated}
      />
    </div>
  );
}
