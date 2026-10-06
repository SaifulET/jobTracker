"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { SearchBar } from "@/components/jobs/SearchBar";
import { FilterBar } from "@/components/jobs/FilterBar";
import { JobTable } from "@/components/jobs/JobTable";
import { Pagination } from "@/components/jobs/Pagination";
import { JobFormModal } from "@/components/jobs/JobFormModal";
import { IJob, PaginatedJobsResponse } from "@/types/job";
import { Button } from "@/components/ui/Button";
import { Plus, RefreshCw, Briefcase } from "lucide-react";
import { toast } from "sonner";

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // State
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);

  // Query state initialized from URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "All");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [company, setCompany] = useState(searchParams.get("company") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "applicationDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc"
  );
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [limit, setLimit] = useState(
    parseInt(searchParams.get("limit") || "10", 10)
  );
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Sync URL when state changes
  const updateUrlParams = useCallback(
    (newParams: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, val]) => {
        if (val && val !== "All" && val !== "") {
          params.set(key, String(val));
        } else {
          params.delete(key);
        }
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search) params.set("search", search);
      if (status && status !== "All") params.set("status", status);
      if (location) params.set("location", location);
      if (company) params.set("company", company);
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const json: PaginatedJobsResponse = await res.json();

      if (json.success) {
        setJobs(json.data);
        setTotal(json.pagination.total);
        setTotalPages(json.pagination.totalPages);
      } else {
        toast.error("Failed to load jobs");
      }
    } catch (error) {
      console.error("Fetch jobs error:", error);
      toast.error("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, status, location, company, sortBy, sortOrder]);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setStatus(searchParams.get("status") || "All");
    setLocation(searchParams.get("location") || "");
    setCompany(searchParams.get("company") || "");
    setSortBy(searchParams.get("sortBy") || "applicationDate");
    setSortOrder((searchParams.get("sortOrder") as "asc" | "desc") || "desc");
    setPage(parseInt(searchParams.get("page") || "1", 10));
    setLimit(parseInt(searchParams.get("limit") || "10", 10));
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();

    const handleJobUpdated = () => {
      fetchJobs();
    };

    window.addEventListener("job-updated", handleJobUpdated);
    return () => window.removeEventListener("job-updated", handleJobUpdated);
  }, [fetchJobs]);

  // Handlers
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
    updateUrlParams({ search: val, page: 1 });
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
    updateUrlParams({ status: val, page: 1 });
  };

  const handleLocationChange = (val: string) => {
    setLocation(val);
    setPage(1);
    updateUrlParams({ location: val, page: 1 });
  };

  const handleCompanyChange = (val: string) => {
    setCompany(val);
    setPage(1);
    updateUrlParams({ company: val, page: 1 });
  };

  const handleSortByChange = (val: string) => {
    setSortBy(val);
    updateUrlParams({ sortBy: val });
  };

  const handleSortOrderChange = (val: "asc" | "desc") => {
    setSortOrder(val);
    updateUrlParams({ sortOrder: val });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrlParams({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
    updateUrlParams({ limit: newLimit, page: 1 });
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("All");
    setLocation("");
    setCompany("");
    setSortBy("applicationDate");
    setSortOrder("desc");
    setPage(1);
    router.replace(pathname, { scroll: false });
  };

  const hasActiveFilters =
    Boolean(search) ||
    status !== "All" ||
    Boolean(location) ||
    Boolean(company) ||
    sortBy !== "applicationDate" ||
    sortOrder !== "desc";

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-enter">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-[#659364] dark:text-[#8cb88b]" />
            Job Applications
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage, filter, and track all your active and historic job submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchJobs}
            className="gap-1.5 h-9 text-xs interactive-button"
            title="Refresh list"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="animate-enter stagger-1">
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          placeholder="Search jobs by title, company, recruiter email, location, or notes..."
        />
      </div>

      {/* Filter Controls Bar */}
      <div className="animate-enter stagger-2">
        <FilterBar
          status={status}
          onStatusChange={handleStatusChange}
          location={location}
          onLocationChange={handleLocationChange}
          company={company}
          onCompanyChange={handleCompanyChange}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Main Job Table / Mobile Cards */}
      <div className="animate-enter stagger-3">
        <JobTable
          jobs={jobs}
          isLoading={isLoading}
          page={page}
          limit={limit}
          onRefresh={fetchJobs}
          onOpenAddJob={() => setIsAddJobOpen(true)}
        />
      </div>

      {/* Pagination Bar */}
      {!isLoading && jobs.length > 0 && (
        <div className="animate-enter stagger-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      )}

      {/* Add Job Modal */}
      <JobFormModal
        open={isAddJobOpen}
        onOpenChange={setIsAddJobOpen}
        onSuccess={() => {
          setIsAddJobOpen(false);
          fetchJobs();
        }}
      />
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <AppLayout
      title="Applications"
      subtitle="Full repository of tracked job applications with search, filtering, and timeline updates"
    >
      <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading applications...</div>}>
        <ApplicationsContent />
      </Suspense>
    </AppLayout>
  );
}
