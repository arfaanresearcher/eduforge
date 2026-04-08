import { NextResponse } from "next/server";
import { createCourseNotebook } from "@/lib/notebooklm";
import { getMockCourseBySlug } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const { courseSlug } = await request.json();
    const course = getMockCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const result = await createCourseNotebook(course.title, course.modules);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create notebook";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
