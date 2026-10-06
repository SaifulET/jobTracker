export type JobStatus =
  | "Saved"
  | "Applied"
  | "Follow Up"
  | "Interview"
  | "Technical Test"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

export const JOB_STATUSES: JobStatus[] = [
  "Saved",
  "Applied",
  "Follow Up",
  "Interview",
  "Technical Test",
  "Offer",
  "Rejected",
  "Withdrawn",
];

export interface IInterviewUpdate {
  _id?: string;
  id?: string;
  date: string | Date;
  title?: string;
  content: string;
  createdAt?: string | Date;
}

export interface IFollowUp {
  _id?: string;
  id?: string;
  date: string | Date;
  type: "Gmail";
  subject?: string;
  content?: string;
  note?: string;
  createdAt?: string | Date;
}

export interface IJob {
  _id: string;
  jobTitle: string;
  companyName: string;
  recruiterName?: string;
  recruiterEmail?: string;
  location?: string;
  jobDescriptionShort: string;
  jobDescriptionFull?: string;
  cvLink?: string;
  cvName?: string;
  websiteLink?: string;
  applicationDate?: string | Date;
  status: JobStatus;
  interviewUpdates: IInterviewUpdate[];
  followUps: IFollowUp[];
  followUpCount: number;
  extraNote?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedJobsResponse {
  success: boolean;
  data: IJob[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DashboardStats {
  total: number;
  saved: number;
  applied: number;
  followUp: number;
  interview: number;
  technicalTest: number;
  offer: number;
  rejected: number;
  withdrawn: number;
  followUpRequired: number;
  applicationSuccessRate: number; // (Offer / Total) * 100
  interviewRate: number; // ((Interview + Technical Test + Offer) / Total) * 100
  offerRate: number; // (Offer / (Interview + Technical Test + Offer)) * 100 or (Offer / Total) * 100
  statusDistribution: {
    status: JobStatus;
    count: number;
    color: string;
  }[];
  timelineData: {
    period: string;
    applications: number;
    interviews: number;
    offers: number;
  }[];
  recentJobs: IJob[];
}
