"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QuizBlock } from "@/components/learning/QuizBlock";
import {
  getMockCourseBySlug,
  getMockLesson,
  type MockModule,
  type MockLesson,
} from "@/lib/mock-data";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  X,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function LessonPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;

  const mockCourse = useMemo(() => getMockCourseBySlug(courseSlug), [courseSlug]);
  const mockLesson = useMemo(
    () => getMockLesson(courseSlug, moduleId, lessonId),
    [courseSlug, moduleId, lessonId],
  );

  const [course, setCourse] = useState(
    mockCourse
      ? {
          slug: mockCourse.slug,
          title: mockCourse.title,
          modules: mockCourse.modules.map((m: MockModule) => ({
            id: m.id,
            title: m.title,
            order: m.order,
            lessons: m.lessons.map((l: MockLesson) => ({
              id: l.id,
              title: l.title,
              content: l.content,
              videoUrl: l.videoUrl,
              duration: l.duration,
              hasQuiz: l.hasQuiz,
              quizData: l.quizData,
            })),
          })),
        }
      : null,
  );

  const [lesson, setLesson] = useState(
    mockLesson
      ? {
          id: mockLesson.id,
          title: mockLesson.title,
          content: mockLesson.content,
          videoUrl: mockLesson.videoUrl,
          duration: mockLesson.duration,
          hasQuiz: mockLesson.hasQuiz,
          quizData: mockLesson.quizData,
        }
      : null,
  );

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Try fetching from API as well (will succeed if DB is available)
  useEffect(() => {
    fetch(`/api/courses?slug=${courseSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.courses?.[0]) {
          const apiCourse = data.courses[0];
          setCourse({
            slug: apiCourse.slug,
            title: apiCourse.title,
            modules: apiCourse.modules ?? [],
          });
          const mod = apiCourse.modules?.find(
            (m: { id: string }) => m.id === moduleId,
          );
          const les = mod?.lessons?.find(
            (l: { id: string }) => l.id === lessonId,
          );
          if (les) setLesson(les);
        }
      })
      .catch(() => {
        // API unavailable — keep using mock data
      });
  }, [courseSlug, moduleId, lessonId]);

  const handleMarkComplete = useCallback(async () => {
    try {
      await fetch(`/api/courses/${courseSlug}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: !completed }),
      });
    } catch {
      // Silently fail if API unavailable
    }
    setCompleted((c) => !c);
  }, [courseSlug, lessonId, completed]);

  const sendChat = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "lesson",
          contextId: lessonId,
          message: msg,
          history: chatMessages,
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) return;

      let assistantMsg = "";
      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            assistantMsg += parsed.text;
            setChatMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantMsg,
              };
              return updated;
            });
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "AI tutor is currently unavailable. Please try again later.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, lessonId, chatMessages]);

  // Navigation helpers
  const allLessons =
    course?.modules?.flatMap((m) =>
      m.lessons.map((l) => ({ ...l, moduleId: m.id })),
    ) ?? [];
  const currentIdx = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">
          Loading lesson...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left sidebar -- course nav */}
      <aside className="w-64 border-r border-white/10 overflow-y-auto glass hidden lg:block">
        <div className="p-4 border-b border-white/10">
          <Link
            href={`/learn/${courseSlug}`}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ChevronLeft className="h-3 w-3" />
            Back to course
          </Link>
          <h3 className="font-semibold mt-2 text-sm line-clamp-2">
            {course?.title}
          </h3>
        </div>
        <nav className="p-2">
          {course?.modules?.map((mod) => (
            <div key={mod.id} className="mb-3">
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                {mod.title}
              </div>
              {mod.lessons.map((les) => (
                <Link
                  key={les.id}
                  href={`/learn/${courseSlug}/${mod.id}/${les.id}`}
                  className={cn(
                    "block px-2 py-1.5 text-sm rounded-md",
                    les.id === lessonId
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted",
                  )}
                >
                  {les.title}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8 space-y-6">
          <h1 className="text-2xl font-bold gradient-text">{lesson.title}</h1>

          {lesson.videoUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-black glass">
              <iframe
                src={lesson.videoUrl}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          <Card className="glass">
            <CardContent className="p-6">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {lesson.content.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {lesson.hasQuiz && lesson.quizData?.questions && (
            <>
              <Separator />
              <Card className="glass neon-border">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Lesson Quiz</h2>
                  <QuizBlock questions={lesson.quizData.questions} />
                </CardContent>
              </Card>
            </>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <Button
              onClick={handleMarkComplete}
              variant={completed ? "outline" : "default"}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {completed ? "Completed" : "Mark Complete"}
            </Button>

            <div className="flex gap-2">
              {prevLesson && (
                <Link
                  href={`/learn/${courseSlug}/${prevLesson.moduleId}/${prevLesson.id}`}
                >
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                </Link>
              )}
              {nextLesson && (
                <Link
                  href={`/learn/${courseSlug}/${nextLesson.moduleId}/${nextLesson.id}`}
                >
                  <Button size="sm">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat panel */}
      <div
        className={cn(
          "border-l border-white/10 glass flex flex-col transition-all",
          chatOpen ? "w-80" : "w-0",
        )}
      >
        {chatOpen && (
          <>
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <span className="font-semibold text-sm gradient-text">AI Tutor</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Ask anything about this lesson
                </p>
              )}
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "text-sm rounded-lg px-3 py-2 max-w-[90%]",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "glass",
                  )}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-white/10 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask a question..."
                className="flex-1 text-sm px-3 py-2 rounded-md border border-white/10 glass bg-transparent"
              />
              <Button size="sm" onClick={sendChat} disabled={chatLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Chat toggle button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow neon-border"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
