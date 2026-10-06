import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";
import { interviewUpdateSchema } from "@/lib/validations/job";
import { ZodError } from "zod";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; updateId: string } }
) {
  try {
    await connectToDatabase();
    const { id, updateId } = params;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(updateId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = interviewUpdateSchema.partial().parse(body);

    const updateFields: Record<string, unknown> = {};
    if (validatedData.date) {
      updateFields["interviewUpdates.$.date"] = validatedData.date;
    }
    if (validatedData.title !== undefined) {
      updateFields["interviewUpdates.$.title"] = validatedData.title;
    }
    if (validatedData.content !== undefined) {
      updateFields["interviewUpdates.$.content"] = validatedData.content;
    }

    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, "interviewUpdates._id": updateId },
      { $set: updateFields },
      { new: true }
    ).lean();

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, message: "Job or update record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: "Update modified successfully.",
    });
  } catch (error: unknown) {
    console.error(`PATCH /api/jobs/${params.id}/updates/${params.updateId} error:`, error);
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
    const msg = error instanceof Error ? error.message : "Failed to modify update";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; updateId: string } }
) {
  try {
    await connectToDatabase();
    const { id, updateId } = params;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(updateId)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        $pull: { interviewUpdates: { _id: updateId } },
      },
      { new: true }
    ).lean();

    if (!updatedJob) {
      return NextResponse.json(
        { success: false, message: "Job application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: "Interview update removed successfully.",
    });
  } catch (error: unknown) {
    console.error(`DELETE /api/jobs/${params.id}/updates/${params.updateId} error:`, error);
    const msg = error instanceof Error ? error.message : "Failed to delete update";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
