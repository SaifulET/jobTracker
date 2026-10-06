import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";
import { jobSchema } from "@/lib/validations/job";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid job ID format" },
        { status: 400 }
      );
    }

    const job = await Job.findById(id).lean();

    if (!job) {
      return NextResponse.json(
        { success: false, message: "Job application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: job,
    });
  } catch (error: unknown) {
    console.error(`GET /api/jobs/${params.id} error:`, error);
    const msg = error instanceof Error ? error.message : "Failed to fetch job";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid job ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const partialSchema = jobSchema.partial();
    const validatedData = partialSchema.parse(body);

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: validatedData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, message: "Job application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedJob,
      message: "Job application updated successfully.",
    });
  } catch (error: unknown) {
    console.error(`PATCH /api/jobs/${params.id} error:`, error);
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
    const msg = error instanceof Error ? error.message : "Failed to update job";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid job ID format" },
        { status: 400 }
      );
    }

    const deleted = await Job.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Job application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Job application deleted successfully.",
    });
  } catch (error: unknown) {
    console.error(`DELETE /api/jobs/${params.id} error:`, error);
    const msg = error instanceof Error ? error.message : "Failed to delete job";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
