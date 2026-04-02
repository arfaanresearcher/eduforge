import { NextRequest, NextResponse } from "next/server";
import { getMockCourses } from "@/lib/mock-data";

export async function GET(req: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const level = url.searchParams.get("level");
    const search = url.searchParams.get("search");
    const tags = url.searchParams.get("tags");
    const slug = url.searchParams.get("slug");

    const where: Record<string, unknown> = { published: true };

    if (type) where.type = type;
    if (level) where.level = level;
    if (slug) where.slug = slug;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    if (tags) {
      where.tags = { hasSome: tags.split(",") };
    }

    const courses = await db.course.findMany({
      where,
      include: {
        _count: { select: { enrollments: true } },
        modules: {
          include: {
            lessons: { orderBy: { order: "asc" } },
            _count: { select: { lessons: true } },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Courses list error (falling back to mock):", error);
    const url = new URL(req.url);
    const type = url.searchParams.get("type") ?? undefined;
    const level = url.searchParams.get("level") ?? undefined;
    const search = url.searchParams.get("search") ?? undefined;
    const slug = url.searchParams.get("slug") ?? undefined;

    let courses = getMockCourses({ type, level, search });
    if (slug) {
      courses = courses.filter((c) => c.slug === slug);
    }
    return NextResponse.json({ courses });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { db } = await import("@/lib/db");
    const { getCurrentUser } = await import("@/lib/auth");

    const user = await getCurrentUser();
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const course = await db.course.create({ data: body });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
