import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logEvent, RECOMMENDATION_FEEDBACK } from "@/lib/activity";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { recommendationId, feedback } = await req.json();

    if (!recommendationId || (feedback !== 1 && feedback !== -1)) {
      return NextResponse.json(
        { error: "recommendationId and feedback (1 or -1) required" },
        { status: 400 },
      );
    }

    await db.recommendation.update({
      where: { id: recommendationId },
      data: { feedback },
    });

    logEvent(user.id, RECOMMENDATION_FEEDBACK, { recommendationId, feedback });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
