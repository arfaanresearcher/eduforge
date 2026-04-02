import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { streamLessonChat, streamBuilderChat } from "@/lib/ai";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { type, contextId, message, history } = await req.json();

    if (!type || !message) {
      return new Response(JSON.stringify({ error: "type and message required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let stream: ReadableStream;

    if (type === "lesson") {
      const lesson = await db.lesson.findUniqueOrThrow({
        where: { id: contextId },
      });
      stream = streamLessonChat(lesson.content, message, history ?? []);
    } else if (type === "builder") {
      const prototype = await db.prototype.findUniqueOrThrow({
        where: { id: contextId },
      });
      const context = `Title: ${prototype.title}\nDescription: ${prototype.description}\nTech Stack: ${prototype.techStack.join(", ")}`;
      stream = streamBuilderChat(context, message, history ?? []);
    } else {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    void user; // used for auth check

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    if (message === "Unauthorized") {
      return new Response(JSON.stringify({ error: message }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
