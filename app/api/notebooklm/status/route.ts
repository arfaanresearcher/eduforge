import { NextResponse } from "next/server";
import { buildCourseTextForDownload } from "@/lib/notebooklm";
import { getMockCourseBySlug } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("courseSlug");

  if (!courseSlug) {
    return NextResponse.json({ error: "courseSlug required" }, { status: 400 });
  }

  const course = getMockCourseBySlug(courseSlug);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const text = buildCourseTextForDownload(course.title, course.modules);

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${course.slug}-notes.txt"`,
    },
  });
}
