import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getLearnerRecommendations } from "@/lib/ai";
import { logEvent, RECOMMENDATION_VIEWED } from "@/lib/activity";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimit: Ratelimit | null = null;
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_URL !== "https://placeholder.upstash.io"
) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, "1 m"),
  });
}

export async function POST() {
  try {
    const user = await getCurrentUser();

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
