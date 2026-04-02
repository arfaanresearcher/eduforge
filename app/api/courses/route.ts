import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Role, CourseType, CourseLevel } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") as CourseType | null;
    const level = url.searchParams.get("level") as CourseLevel | null;
    const search = url.searchParams.get("search");
    const tags = url.searchParams.get("tags");

    const where: Record<string, unknown> = { published: true };

    if (type) where.type = type;
    if (level) where.level = level;
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
          include: { _count: { select: { lessons: true } } },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Courses list error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user.role !== Role.ADMIN) {
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
