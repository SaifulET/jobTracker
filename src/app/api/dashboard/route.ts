import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Job from "@/models/Job";
import { JobStatus, JOB_STATUSES, DashboardStats } from "@/types/job";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

const STATUS_CHART_COLORS: Record<JobStatus, string> = {
  Saved: "#64748b", // slate-500
  Applied: "#3b82f6", // blue-500
  "Follow Up": "#f59e0b", // amber-500
  Interview: "#a855f7", // purple-500
  "Technical Test": "#6366f1", // indigo-500
  Offer: "#10b981", // emerald-500
  Rejected: "#f43f5e", // rose-500
  Withdrawn: "#71717a", // zinc-500
};

export async function GET() {
  try {
    await connectToDatabase();

    // Aggregations for status counts
    const statusCountsAgg = await Job.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const countsMap: Record<string, number> = {};
    JOB_STATUSES.forEach((s) => {
      countsMap[s] = 0;
    });

    statusCountsAgg.forEach((item) => {
      if (item._id && countsMap[item._id] !== undefined) {
        countsMap[item._id] = item.count;
      }
    });

    const total = await Job.countDocuments();
    const saved = countsMap["Saved"] || 0;
    const applied = countsMap["Applied"] || 0;
    const followUp = countsMap["Follow Up"] || 0;
    const interview = countsMap["Interview"] || 0;
    const technicalTest = countsMap["Technical Test"] || 0;
    const offer = countsMap["Offer"] || 0;
    const rejected = countsMap["Rejected"] || 0;
    const withdrawn = countsMap["Withdrawn"] || 0;

    const followUpRequired = followUp;

    // Rates calculation
    const interviewStageCount = interview + technicalTest + offer;
    const interviewRate = total > 0 ? Math.round((interviewStageCount / total) * 100) : 0;
    const offerRate = interviewStageCount > 0 ? Math.round((offer / interviewStageCount) * 100) : 0;
    const applicationSuccessRate = total > 0 ? Math.round((offer / total) * 100) : 0;

    // Status distribution array for charts
    const statusDistribution = JOB_STATUSES.map((status) => ({
      status,
      count: countsMap[status] || 0,
      color: STATUS_CHART_COLORS[status],
    })).filter((item) => item.count > 0 || ["Applied", "Interview", "Offer", "Rejected"].includes(item.status));

    // Timeline breakdown (last 6 months)
    const now = new Date();
    const timelineData = [];

    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      const period = format(monthDate, "MMM yyyy");

      const [monthApplied, monthInterview, monthOffer] = await Promise.all([
        Job.countDocuments({
          applicationDate: { $gte: monthStart, $lte: monthEnd },
        }),
        Job.countDocuments({
          status: { $in: ["Interview", "Technical Test"] },
          updatedAt: { $gte: monthStart, $lte: monthEnd },
        }),
        Job.countDocuments({
          status: "Offer",
          updatedAt: { $gte: monthStart, $lte: monthEnd },
        }),
      ]);

      timelineData.push({
        period,
        applications: monthApplied,
        interviews: monthInterview,
        offers: monthOffer,
      });
    }

    // Top 5 recent jobs
    const recentJobs = await Job.find()
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(5)
      .lean();

    const stats: DashboardStats = {
      total,
      saved,
      applied,
      followUp,
      interview,
      technicalTest,
      offer,
      rejected,
      withdrawn,
      followUpRequired,
      applicationSuccessRate,
      interviewRate,
      offerRate,
      statusDistribution,
      timelineData,
      recentJobs: JSON.parse(JSON.stringify(recentJobs)),
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: unknown) {
    console.error("GET /api/dashboard error:", error);
    const msg = error instanceof Error ? error.message : "Failed to fetch dashboard stats";
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}
