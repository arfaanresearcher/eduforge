import { NextResponse } from "next/server";
import { getNotebook, getNotebookUrl } from "@/lib/notebooklm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const notebookId = searchParams.get("notebookId");
    if (!notebookId) {
      return NextResponse.json({ error: "notebookId required" }, { status: 400 });
    }

    const notebook = await getNotebook(notebookId);
    return NextResponse.json({
      ...notebook,
      notebookUrl: getNotebookUrl(notebookId),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get notebook";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
