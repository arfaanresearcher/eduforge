import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createSandbox } from "@/lib/sandbox";
import { db } from "@/lib/db";
import { logEvent, SANDBOX_STARTED } from "@/lib/activity";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { prototypeId, techStack } = await req.json();

    if (!prototypeId || !techStack) {
      return NextResponse.json(
        { error: "prototypeId and techStack required" },
        { status: 400 },
      );
    }

    const prototype = await db.prototype.findUniqueOrThrow({
      where: { id: prototypeId },
    });

    if (prototype.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await createSandbox(user.id, prototypeId, techStack);
    logEvent(user.id, SANDBOX_STARTED, { prototypeId, sandboxId: result.sandboxId });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
