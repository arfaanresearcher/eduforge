import { NextResponse } from "next/server";
import { chatWithCourseContent } from "@/lib/notebooklm";
import { getMockCourseBySlug } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const { courseSlug, message } = await request.json();
    const course = getMockCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Build full course content string
    const content = course.modules
      .flatMap((m) => m.lessons.map((l) => `## ${m.title} — ${l.title}\n${l.content}`))
      .join("\n\n---\n\n");

    const response = await chatWithCourseContent(course.title, content, message);
    return NextResponse.json({ response });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
