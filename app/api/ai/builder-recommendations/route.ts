import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getBuilderRecommendations } from "@/lib/ai";
import { logEvent, RECOMMENDATION_VIEWED } from "@/lib/activity";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { prototypeId } = await req.json();

    if (!prototypeId) {
      return NextResponse.json({ error: "prototypeId required" }, { status: 400 });
    }

    const recommendations = await getBuilderRecommendations(user.id, prototypeId);
    logEvent(user.id, RECOMMENDATION_VIEWED, { type: "builder", prototypeId });

    return NextResponse.json({ recommendations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
