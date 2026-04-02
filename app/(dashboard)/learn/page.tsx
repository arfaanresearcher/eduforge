import { getMockCourses, getMockEnrollments } from "@/lib/mock-data";
import { CourseCard } from "@/components/learning/CourseCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default async function LearnPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; level?: string; search?: string }>;
}) {
  const sp = await searchParams;

  let courses;
  let enrollments: Record<string, number> = {};

  try {
    const { db } = await import("@/lib/db");
    const { auth } = await import("@clerk/nextjs/server");
    const { userId: clerkId } = await auth();

    const where: Record<string, unknown> = { published: true };
    if (sp.type) where.type = sp.type;
    if (sp.level) where.level = sp.level;
    if (sp.search) {
      where.OR = [
        { title: { contains: sp.search, mode: "insensitive" } },
        { description: { contains: sp.search, mode: "insensitive" } },
      ];
    }

    courses = await db.course.findMany({
      where,
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (clerkId) {
      const dbUser = await db.user.findUnique({ where: { clerkId } });
      if (dbUser) {
        const userEnrollments = await db.enrollment.findMany({
          where: { userId: dbUser.id },
        });
        enrollments = Object.fromEntries(
          userEnrollments.map((e: { courseId: string; progress: number }) => [e.courseId, e.progress]),
        );
      }
    }
  } catch {
    // DB unavailable — fall back to mock data
  }

  courses = courses ?? getMockCourses({ type: sp.type, level: sp.level, search: sp.search });
  enrollments = Object.keys(enrollments).length > 0 ? enrollments : getMockEnrollments();

  const types = ["ALL", "DIPLOMA", "SHORT_COURSE", "CERTIFICATION"];
  const levels = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Learning Hub</h1>
        <p className="text-muted-foreground mt-1">
          Explore courses and build your skills
        </p>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <form className="flex-1 min-w-[200px] max-w-md">
          <Input
            name="search"
            placeholder="Search courses..."
            defaultValue={sp.search ?? ""}
            className="glass border-white/10"
          />
        </form>

        <div className="flex gap-2">
          {types.map((t) => (
            <a
              key={t}
              href={`/learn${t === "ALL" ? "" : `?type=${t}`}`}
            >
              <Badge
                variant={
                  (sp.type === t || (!sp.type && t === "ALL"))
                    ? "default"
                    : "secondary"
                }
                className="cursor-pointer neon-border"
              >
                {t.replace("_", " ")}
              </Badge>
            </a>
          ))}
        </div>

        <div className="flex gap-2">
          {levels.map((l) => (
            <a
              key={l}
              href={`/learn${l === "ALL" ? "" : `?level=${l}`}`}
            >
              <Badge
                variant={
                  (sp.level === l || (!sp.level && l === "ALL"))
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer neon-border"
              >
                {l}
              </Badge>
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            slug={course.slug}
            title={course.title}
            description={course.description}
            type={course.type}
            level={course.level}
            price={course.price}
            duration={course.duration}
            instructorName={course.instructorName}
            enrollmentCount={course._count.enrollments}
            userProgress={enrollments[course.id] ?? null}
          />
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12 text-muted-foreground glass rounded-xl p-8">
          No courses found matching your filters.
        </div>
      )}
    </div>
  );
}
