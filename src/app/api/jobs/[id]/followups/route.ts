import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";
import { followUpSchema } from "@/lib/validations/job";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function POST(
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
    const validatedData = followUpSchema.parse(body);

    const followUpItem = {
      _id: new mongoose.Types.ObjectId(),
      ...validatedData,
      createdAt: new Date(),
    };

    // Push item and increment followUpCount
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        $push: { followUps: followUpItem },
        $inc: { followUpCount: 1 },
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, message: "Job application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: followUpItem,
        job: updatedJob,
        message: "Follow-up logged successfully.",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error(`POST /api/jobs/${params.id}/followups error:`, error);
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
    const msg = error instanceof Error ? error.message : "Failed to log follow-up";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
