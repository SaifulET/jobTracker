import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { profileSchema } from "@/lib/validations/profile";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

const DEFAULT_PROFILE = {
  fullName: "Saiful Islam",
  professionalTitle: "Executive Full-Stack Developer",
  email: "saiful.dev@example.com",
  phone: "+880 1700 000000",
  location: "Dhaka, Bangladesh",
  github: "https://github.com/saiful",
  linkedin: "https://linkedin.com/in/saiful",
  portfolio: "https://saiful.dev",
  defaultCv: "https://drive.google.com/file/d/sample-cv/view",
  defaultCvName: "Saiful_Islam_FullStack_Resume.pdf",
  bio: "Passionate Full-Stack Developer with 6+ years of experience designing and scaling modern React, Next.js, Node.js, and cloud architectures. Looking for impactful engineering roles in high-growth products.",
};

export async function GET() {
  try {
    await connectToDatabase();

    let profile = await Profile.findOne().lean();

    if (!profile) {
      await Profile.create(DEFAULT_PROFILE);
      profile = await Profile.findOne().lean();
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error: unknown) {
    console.error("GET /api/profile error:", error);
    const msg = error instanceof Error ? error.message : "Failed to fetch profile";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    let profile = await Profile.findOne();

    if (!profile) {
      profile = await Profile.create(validatedData);
    } else {
      Object.assign(profile, validatedData);
      await profile.save();
    }

    return NextResponse.json({
      success: true,
      data: profile,
      message: "Profile updated successfully.",
    });
  } catch (error: unknown) {
    console.error("PATCH /api/profile error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const msg = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
