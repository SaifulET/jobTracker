import mongoose, { Schema, Model, Document } from "mongoose";
import { IJob, IInterviewUpdate, IFollowUp, JobStatus, JOB_STATUSES } from "@/types/job";

export interface IJobDocument extends Omit<IJob, "_id">, Document {}

const InterviewUpdateSchema = new Schema<IInterviewUpdate>(
  {
    date: {
      type: Date,
      required: [true, "Update date is required"],
      default: Date.now,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: [true, "Update content is required"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const FollowUpSchema = new Schema<IFollowUp>(
  {
    date: {
      type: Date,
      required: [true, "Follow-up date is required"],
      default: Date.now,
    },
    type: {
      type: String,
      enum: ["Gmail"],
      default: "Gmail",
      required: true,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const JobSchema = new Schema<IJobDocument>(
  {
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 150,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 100,
      index: true,
    },
    recruiterName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    recruiterEmail: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
      index: true,
    },
    jobDescriptionShort: {
      type: String,
      required: [true, "Short job description is required"],
      trim: true,
    },
    jobDescriptionFull: {
      type: String,
      trim: true,
    },
    cvLink: {
      type: String,
      trim: true,
    },
    cvName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    websiteLink: {
      type: String,
      trim: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    status: {
      type: String,
      enum: JOB_STATUSES,
      default: "Saved",
      index: true,
    },
    interviewUpdates: {
      type: [InterviewUpdateSchema],
      default: [],
    },
    followUps: {
      type: [FollowUpSchema],
      default: [],
    },
    followUpCount: {
      type: Number,
      default: 0,
    },
    extraNote: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save hook to automatically maintain followUpCount
JobSchema.pre("save", function (next) {
  if (this.followUps) {
    this.followUpCount = this.followUps.length;
  }
  next();
});

// Composite and text indexes for fast search and filtering
JobSchema.index({ status: 1, applicationDate: -1 });
JobSchema.index({ companyName: 1, jobTitle: 1 });
JobSchema.index({
  jobTitle: "text",
  companyName: "text",
  recruiterEmail: "text",
  location: "text",
  jobDescriptionShort: "text",
});

const Job: Model<IJobDocument> =
  mongoose.models.Job || mongoose.model<IJobDocument>("Job", JobSchema);

export default Job;
