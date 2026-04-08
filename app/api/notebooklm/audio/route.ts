import { NextResponse } from "next/server";
import { generateStudyGuide, generateFlashcards, generateQuiz } from "@/lib/notebooklm";
import { getMockCourseBySlug } from "@/lib/mock-data";

export async function POST(request: Request) {
  try {
    const { courseSlug, tool, lessonId } = await request.json();
    const course = getMockCourseBySlug(courseSlug);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const fullContent = course.modules
      .flatMap((m) => m.lessons.map((l) => `## ${l.title}\n${l.content}`))
      .join("\n\n");

    if (tool === "study-guide") {
      const guide = await generateStudyGuide(course.title, fullContent);
      return NextResponse.json({ result: guide });
    }

    if (tool === "flashcards") {
      // Find the specific lesson
      const lesson = course.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
      const cards = await generateFlashcards(course.title, lesson?.content ?? fullContent, lesson?.title ?? course.title);
      return NextResponse.json({ result: cards });
    }

    if (tool === "quiz") {
      const lesson = course.modules.flatMap((m) => m.lessons).find((l) => l.id === lessonId);
      const quiz = await generateQuiz(course.title, lesson?.content ?? fullContent, lesson?.title ?? course.title);
      return NextResponse.json({ result: quiz });
    }

    return NextResponse.json({ error: "Unknown tool" }, { status: 400 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
