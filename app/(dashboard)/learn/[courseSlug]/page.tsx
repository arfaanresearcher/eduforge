import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProgressBar } from "@/components/learning/ProgressBar";
import { Clock, BookOpen, CheckCircle2, ChevronRight } from "lucide-react";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = await params;
  const { userId: clerkId } = await auth();

  const course = await db.course.findUnique({
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

  if (!course) notFound();

  let enrollment = null;
  if (clerkId) {
    const dbUser = await db.user.findUnique({ where: { clerkId } });
    if (dbUser) {
      enrollment = await db.enrollment.findUnique({
        where: { userId_courseId: { userId: dbUser.id, courseId: course.id } },
      });
    }
  }

  const totalLessons = course.modules.reduce(
    (sum: number, m: { lessons: unknown[] }) => sum + m.lessons.length,
    0,
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge>{course.type.replace("_", " ")}</Badge>
              <Badge variant="outline">{course.level}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground text-lg">
              {course.description}
            </p>
            {course.instructorName && (
              <p className="text-sm">
                by <span className="font-medium">{course.instructorName}</span>
              </p>
            )}
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {course.duration} hours
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" /> {totalLessons} lessons
              </span>
              <span>{course._count.enrollments} enrolled</span>
            </div>
          </div>

          {enrollment && (
            <ProgressBar value={enrollment.progress} className="max-w-md" />
          )}

          {course.longDescription && (
            <div>
              <h2 className="text-xl font-semibold mb-2">About this course</h2>
              <p className="text-muted-foreground">{course.longDescription}</p>
            </div>
          )}

          <Separator />

          <div>
            <h2 className="text-xl font-semibold mb-4">Curriculum</h2>
            <div className="space-y-4">
              {course.modules.map((module) => (
                <Card key={module.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3">
                      Module {module.order}: {module.title}
                    </h3>
                    <div className="space-y-1">
                      {module.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={
                            enrollment
                              ? `/learn/${courseSlug}/${module.id}/${lesson.id}`
                              : "#"
                          }
                          className={`flex items-center justify-between p-2 rounded-md text-sm ${
                            enrollment
                              ? "hover:bg-muted cursor-pointer"
                              : "opacity-60"
                          }`}
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
          <Card className="sticky top-8">
            <CardContent className="p-6 space-y-4">
              {!enrollment ? (
                <>
                  <div className="text-3xl font-bold">${course.price}</div>
                  <form action={`/api/courses/${course.slug}/enroll`} method="POST">
                    <Button className="w-full" size="lg">
                      Enroll Now
                    </Button>
                  </form>
                </>
              ) : enrollment.status === "COMPLETED" ? (
                <Button className="w-full" size="lg" variant="outline" disabled>
                  Completed
                </Button>
              ) : (
                <Link
                  href={`/learn/${courseSlug}/${course.modules[0]?.id}/${course.modules[0]?.lessons[0]?.id}`}
                >
                  <Button className="w-full" size="lg">
                    Continue Learning
                  </Button>
                </Link>
              )}

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
                    {course.tags.map((tag) => (
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
