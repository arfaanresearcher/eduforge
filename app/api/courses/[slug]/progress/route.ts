import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logEvent, LESSON_COMPLETED, CERTIFICATE_ISSUED } from "@/lib/activity";
import { uploadCertificatePDF } from "@/lib/storage";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const user = await getCurrentUser();
    const { slug } = await params;
    const { lessonId, completed } = await req.json();

    if (!lessonId || typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "lessonId and completed required" },
        { status: 400 },
      );
    }

    const course = await db.course.findUniqueOrThrow({
      where: { slug },
      include: {
        modules: {
          include: { lessons: true },
          orderBy: { order: "asc" },
        },
      },
    });

    const enrollment = await db.enrollment.findUniqueOrThrow({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
    });

    // Calculate progress
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const totalLessons = allLessons.length;

    if (totalLessons === 0) {
      return NextResponse.json({ progress: 0 });
    }

    // Store completed lessons in enrollment metadata
    const completedLessons: string[] = Array.isArray(
      (enrollment as Record<string, unknown>).completedLessons,
    )
      ? ((enrollment as Record<string, unknown>).completedLessons as string[])
      : [];

    if (completed && !completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    } else if (!completed) {
      const idx = completedLessons.indexOf(lessonId);
      if (idx > -1) completedLessons.splice(idx, 1);
    }

    const progress = Math.round((completedLessons.length / totalLessons) * 100);

    const updatedEnrollment = await db.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress,
        completedAt: progress >= 100 ? new Date() : null,
        status: progress >= 100 ? "COMPLETED" : "ACTIVE",
      },
    });

    if (completed) {
      logEvent(user.id, LESSON_COMPLETED, { lessonId, courseSlug: slug });
    }

    // Issue certificate on completion
    if (progress >= 100) {
      const existingCert = await db.certificate.findFirst({
        where: { userId: user.id, courseId: course.id },
      });

      if (!existingCert) {
        const certificate = await db.certificate.create({
          data: {
            userId: user.id,
            courseId: course.id,
            verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/verify`,
          },
        });

        // Generate and upload PDF (simplified - in production use @react-pdf/renderer)
        const pdfBuffer = Buffer.from(
          `Certificate of Completion\n${user.name}\n${course.title}\nIssued: ${new Date().toISOString()}\nID: ${certificate.uniqueId}`,
        );
        const pdfUrl = await uploadCertificatePDF(certificate.uniqueId, pdfBuffer);

        await db.certificate.update({
          where: { id: certificate.id },
          data: { pdfUrl },
        });

        logEvent(user.id, CERTIFICATE_ISSUED, {
          courseId: course.id,
          certificateId: certificate.id,
        });
      }
    }

    return NextResponse.json({
      progress: updatedEnrollment.progress,
      status: updatedEnrollment.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
