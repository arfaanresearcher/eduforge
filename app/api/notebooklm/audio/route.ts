import { NextResponse } from "next/server";
import { createAudioOverview } from "@/lib/notebooklm";

export async function POST(request: Request) {
  try {
    const { notebookId, episodeFocus, languageCode } = await request.json();
    if (!notebookId) {
      return NextResponse.json({ error: "notebookId required" }, { status: 400 });
    }

    const result = await createAudioOverview(notebookId, episodeFocus, languageCode);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create audio overview";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
