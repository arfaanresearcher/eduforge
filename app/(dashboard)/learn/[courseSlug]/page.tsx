import { getMockCourseBySlug, getMockEnrollments, type MockModule, type MockLesson } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProgressBar } from "@/components/learning/ProgressBar";
import { Clock, BookOpen, CheckCircle2, ChevronRight, NotebookPen } from "lucide-react";

type SLesson = { id: string; title: string; duration: number | null; hasQuiz: boolean; order: number };
type SModule = { id: string; title: string; order: number; lessons: SLesson[] };

const HERO_GRADIENTS: Record<string, string> = {
  DIPLOMA: "",
  SHORT_COURSE: "",
  CERTIFICATION: "",
};

const HERO_INLINE_GRADIENTS: Record<string, string> = {
  DIPLOMA: "linear-gradient(to bottom right, rgba(24,92,107,0.3), rgba(13,59,69,0.2), rgba(24,92,107,0.3))",
  SHORT_COURSE: "linear-gradient(to bottom right, rgba(201,149,111,0.3), rgba(168,123,85,0.2), rgba(201,149,111,0.3))",
  CERTIFICATION: "linear-gradient(to bottom right, rgba(42,136,153,0.3), rgba(24,92,107,0.2), rgba(42,136,153,0.3))",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;

  let course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    longDescription: string | null;
    type: string;
    level: string;
    price: number;
    duration: number;
    tags: string[];
    instructorName: string | null;
    modules: SModule[];
    _count: { enrollments: number };
  } | null = null;

  let enrollmentProgress: number | null = null;
  let enrollmentStatus: string | null = null;

  try {
    const { db } = await import("@/lib/db");
    const { auth } = await import("@clerk/nextjs/server");
    const { userId: clerkId } = await auth();

    const dbCourse = await db.course.findUnique({
      where: { slug: courseSlug },
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: { orderBy: { order: "asc" } },
          },
        },
        _count: { select: { enrollments: true } },
      },
    });

    if (dbCourse) {
      course = dbCourse;

      if (clerkId) {
        const dbUser = await db.user.findUnique({ where: { clerkId } });
        if (dbUser) {
          const enrollment = await db.enrollment.findUnique({
            where: { userId_courseId: { userId: dbUser.id, courseId: dbCourse.id } },
          });
          if (enrollment) {
            enrollmentProgress = enrollment.progress;
            enrollmentStatus = enrollment.status;
          }
        }
      }
    }
  } catch {
    // DB unavailable — fall back to mock data
  }

  if (!course) {
    const mockCourse = getMockCourseBySlug(courseSlug);
    if (!mockCourse) notFound();
    course = mockCourse;
    const mockEnrollments = getMockEnrollments();
    if (mockEnrollments[mockCourse.id] !== undefined) {
      enrollmentProgress = mockEnrollments[mockCourse.id];
      enrollmentStatus = enrollmentProgress >= 100 ? "COMPLETED" : "ACTIVE";
    }
  }

  const totalLessons = (course.modules as SModule[]).reduce(
    (sum: number, m: SModule) => sum + m.lessons.length,
    0,
  );

  const heroInlineGradient = HERO_INLINE_GRADIENTS[course.type] ?? HERO_INLINE_GRADIENTS.DIPLOMA;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Hero banner */}
      <div className="rounded-2xl glass p-8 mb-8" style={{ background: heroInlineGradient }}>
        <div className="flex gap-2 mb-3">
          <Badge>{course.type.replace("_", " ")}</Badge>
          <Badge variant="outline">{course.level}</Badge>
        </div>
        <h1 className="text-3xl font-bold gradient-text">{course.title}</h1>
        <p className="text-muted-foreground text-lg mt-2">
          {course.description}
        </p>
        {course.instructorName && (
          <p className="text-sm mt-2">
            by <span className="font-medium">{course.instructorName}</span>
          </p>
        )}
        <div className="flex gap-6 text-sm text-muted-foreground mt-3">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {course.duration} hours
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> {totalLessons} lessons
          </span>
          <span>{course._count.enrollments} enrolled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {enrollmentProgress !== null && (
            <ProgressBar value={enrollmentProgress} className="max-w-md" />
          )}

          {course.longDescription && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-2">About this course</h2>
              <p className="text-muted-foreground">{course.longDescription}</p>
            </div>
          )}

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">Curriculum</h2>
            <div className="space-y-4">
              {(course.modules as SModule[]).map((module: SModule) => (
                <Card key={module.id} className="glass neon-border">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">
                      Module {module.order}: {module.title}
                    </h3>
                    <div className="space-y-1">
                      {module.lessons.map((lesson: SLesson) => (
                        <Link
                          key={lesson.id}
                          href={`/learn/${courseSlug}/${module.id}/${lesson.id}`}
                          className="flex items-center justify-between p-2 rounded-md text-sm hover:bg-muted cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                            <span>{lesson.title}</span>
                            {lesson.hasQuiz && (
                              <Badge variant="outline" className="text-xs">
                                Quiz
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            {lesson.duration && <span>{lesson.duration}m</span>}
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-8 glass neon-border">
            <CardContent className="p-6 space-y-4">
              {enrollmentStatus === "COMPLETED" ? (
                <Button className="w-full" size="lg" variant="outline" disabled>
                  Completed
                </Button>
              ) : (
                <Link
                  href={`/learn/${courseSlug}/${course.modules[0]?.id}/${(course.modules[0] as SModule)?.lessons[0]?.id}`}
                >
                  <Button className="w-full" size="lg">
                    {enrollmentProgress !== null ? "Continue Learning" : "Start Learning"}
                  </Button>
                </Link>
              )}

              <Link href={`/learn/${courseSlug}/notebook`}>
                <Button className="w-full mt-2" variant="outline" size="lg" style={{ borderColor: '#2A8899', color: '#2A8899' }}>
                  <NotebookPen className="h-4 w-4 mr-2" />
                  AI Notebook
                </Button>
              </Link>

              <div className="text-3xl font-bold gradient-text">${course.price}</div>

              <Separator />

              <div className="space-y-3 text-sm">
                <h4 className="font-semibold">This course includes:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>{course.duration} hours of content</li>
                  <li>{totalLessons} lessons</li>
                  <li>{course.modules.length} modules</li>
                  <li>Certificate of completion</li>
                  <li>AI tutor assistance</li>
                </ul>
              </div>

              {course.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="flex flex-wrap gap-1">
                    {course.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
