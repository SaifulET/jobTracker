import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";
import { jobSchema } from "@/lib/validations/job";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const location = searchParams.get("location")?.trim() || "";
    const company = searchParams.get("company")?.trim() || "";
    const sortBy = searchParams.get("sortBy") || "applicationDate";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Build filter query
    const query: Record<string, unknown> = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (location && location !== "All") {
      query.location = { $regex: location, $options: "i" };
    }

    if (company && company !== "All") {
      query.companyName = { $regex: company, $options: "i" };
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [
        { jobTitle: searchRegex },
        { companyName: searchRegex },
        { recruiterName: searchRegex },
        { recruiterEmail: searchRegex },
        { location: searchRegex },
        { jobDescriptionShort: searchRegex },
        { extraNote: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    // Determine sort field
    const validSortFields: Record<string, string> = {
      applicationDate: "applicationDate",
      companyName: "companyName",
      jobTitle: "jobTitle",
      status: "status",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      followUpCount: "followUpCount",
    };

    const sortField = validSortFields[sortBy] || "applicationDate";
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
      Job.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/jobs error:", error);
    const msg = error instanceof Error ? error.message : "Failed to fetch jobs";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const validatedData = jobSchema.parse(body);

    const newJob = await Job.create({
      ...validatedData,
      interviewUpdates: [],
      followUps: [],
      followUpCount: 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: newJob,
        message: "Job application added successfully.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("POST /api/jobs error:", error);
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
    const msg = error instanceof Error ? error.message : "Failed to create job application";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
