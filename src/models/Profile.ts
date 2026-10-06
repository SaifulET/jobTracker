import mongoose, { Schema, Model, Document } from "mongoose";
import { IProfile } from "@/types/profile";

export interface IProfileDocument extends Omit<IProfile, "_id">, Document {}

const ProfileSchema = new Schema<IProfileDocument>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: 100,
    },
    professionalTitle: {
      type: String,
      required: [true, "Professional title is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    github: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    portfolio: {
      type: String,
      trim: true,
    },
    defaultCv: {
      type: String,
      trim: true,
    },
    defaultCvName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Profile: Model<IProfileDocument> =
  mongoose.models.Profile ||
  mongoose.model<IProfileDocument>("Profile", ProfileSchema);

export default Profile;
