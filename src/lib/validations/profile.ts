import { z } from "zod";

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

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  professionalTitle: z.string().trim().min(1, "Professional title is required").max(100),
  email: z.string().trim().email("Must be a valid email address"),
  phone: z.string().trim().max(30).optional(),
  location: z.string().trim().max(100).optional(),
  github: optionalUrl,
  linkedin: optionalUrl,
  portfolio: optionalUrl,
  defaultCv: optionalUrl,
  defaultCvName: z.string().trim().max(100).optional(),
  bio: z.string().trim().max(1000).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
