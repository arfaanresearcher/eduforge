import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getLearnerRecommendations } from "@/lib/ai";
import { logEvent, RECOMMENDATION_VIEWED } from "@/lib/activity";

function getRatelimit() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  if (!url || url.includes("placeholder")) return null;
  try {
    // Dynamic import to avoid build-time validation
    const { Ratelimit } = require("@upstash/ratelimit");
    const { Redis } = require("@upstash/redis");
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "1 m"),
    });
  } catch {
    return null;
  }
}

export async function POST() {
  try {
    const user = await getCurrentUser();

    const ratelimit = getRatelimit();
    if (ratelimit) {
      const { success } = await ratelimit.limit(user.id);
      if (!success) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Try again in a minute." },
          { status: 429 },
        );
      }
    }

    const recommendations = await getLearnerRecommendations(user.id);
    logEvent(user.id, RECOMMENDATION_VIEWED, { type: "learner" });

    return NextResponse.json({ recommendations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
