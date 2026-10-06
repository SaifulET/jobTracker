import { z } from "zod";

export const jobStatusEnum = z.enum([
  "Saved",
  "Applied",
  "Follow Up",
  "Interview",
  "Technical Test",
  "Offer",
  "Rejected",
  "Withdrawn",
]);

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      if (!val || val.length === 0) return true;
      try {
        const url = new URL(val);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL starting with http:// or https://" }
  );

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      if (!val || val.length === 0) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    },
    { message: "Must be a valid email address" }
  );

export const jobSchema = z.object({
  jobTitle: z.string().trim().min(1, "Job title is required").max(150, "Job title is too long"),
  companyName: z.string().trim().min(1, "Company name is required").max(100, "Company name is too long"),
  recruiterName: z.string().trim().max(100).optional(),
  recruiterEmail: optionalEmail,
  location: z.string().trim().max(100).optional(),
  jobDescriptionShort: z.string().trim().min(1, "Short job description is required"),
  jobDescriptionFull: z.string().trim().optional(),
  cvLink: optionalUrl,
  cvName: z.string().trim().max(100).optional(),
  websiteLink: optionalUrl,
  applicationDate: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val) => (val ? new Date(val) : new Date())),
  status: jobStatusEnum.default("Saved"),
  extraNote: z.string().trim().optional(),
});

export const interviewUpdateSchema = z.object({
  date: z
    .union([z.string(), z.date()])
    .transform((val) => (val ? new Date(val) : new Date())),
  title: z.string().trim().max(150).optional(),
  content: z.string().trim().min(1, "Update content is required"),
});

export const followUpSchema = z.object({
  date: z
    .union([z.string(), z.date()])
    .transform((val) => (val ? new Date(val) : new Date())),
  type: z.literal("Gmail").default("Gmail"),
  subject: z.string().trim().max(200).optional(),
  content: z.string().trim().optional(),
  note: z.string().trim().optional(),
});

export type JobInput = z.infer<typeof jobSchema>;
export type InterviewUpdateInput = z.infer<typeof interviewUpdateSchema>;
export type FollowUpInput = z.infer<typeof followUpSchema>;
