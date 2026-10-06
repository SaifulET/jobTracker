import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";
import { followUpSchema } from "@/lib/validations/job";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; followupId: string } }
) {
  try {
    await connectToDatabase();
    const { id, followupId } = params;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(followupId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = followUpSchema.partial().parse(body);

    const updateFields: Record<string, unknown> = {};
    if (validatedData.date) {
      updateFields["followUps.$.date"] = validatedData.date;
    }
    if (validatedData.subject !== undefined) {
      updateFields["followUps.$.subject"] = validatedData.subject;
    }
    if (validatedData.content !== undefined) {
      updateFields["followUps.$.content"] = validatedData.content;
    }
    if (validatedData.note !== undefined) {
      updateFields["followUps.$.note"] = validatedData.note;
    }

    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, "followUps._id": followupId },
      { $set: updateFields },
      { new: true }
    ).lean();

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, message: "Job or follow-up record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: "Follow-up modified successfully.",
    });
  } catch (error: unknown) {
    console.error(`PATCH /api/jobs/${params.id}/followups/${params.followupId} error:`, error);
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
    const msg = error instanceof Error ? error.message : "Failed to modify follow-up";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; followupId: string } }
) {
  try {
    await connectToDatabase();
    const { id, followupId } = params;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(followupId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        $pull: { followUps: { _id: followupId } },
        $inc: { followUpCount: -1 },
      },
      { new: true }
    ).lean();

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, message: "Job application not found" },
        { status: 404 }
      );
    }

    // Ensure followUpCount does not drop below 0
    if (updatedJob.followUpCount < 0) {
      await Job.findByIdAndUpdate(id, { $set: { followUpCount: 0 } });
      updatedJob.followUpCount = 0;
    }

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: "Follow-up record removed successfully.",
    });
  } catch (error: unknown) {
    console.error(`DELETE /api/jobs/${params.id}/followups/${params.followupId} error:`, error);
    const msg = error instanceof Error ? error.message : "Failed to delete follow-up";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
