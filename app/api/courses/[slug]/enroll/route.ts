import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getCurrentUser();
    const { slug } = await params;

    const course = await db.course.findUniqueOrThrow({
      where: { slug },
      include: { products: true },
    });

    const existing = await db.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
    });

    if (existing && existing.status !== "REFUNDED") {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 },
      );
    }

    const product = course.products[0];
    if (!product) {
      return NextResponse.json(
        { error: "Course has no product configured" },
        { status: 400 },
      );
    }

    const checkoutUrl = await createCheckoutSession(
      user.id,
      course.id,
      product.id,
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
