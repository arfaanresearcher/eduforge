import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { executeCode } from "@/lib/sandbox";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: "code and language required" },
        { status: 400 },
      );
    }

    const sandbox = await db.sandbox.findUniqueOrThrow({
      where: { id },
      include: { prototype: true },
    });

    if (sandbox.prototype.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await executeCode(id, code, language);

    await db.sandbox.update({
      where: { id },
      data: { lastActive: new Date() },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
