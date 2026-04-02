import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uniqueId: string }> },
) {
  try {
    const { uniqueId } = await params;

    const certificate = await db.certificate.findUnique({
      where: { uniqueId },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true, type: true, duration: true } },
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      valid: true,
      certificate: {
        uniqueId: certificate.uniqueId,
        issuedAt: certificate.issuedAt,
        recipientName: certificate.user.name,
        courseTitle: certificate.course.title,
        courseType: certificate.course.type,
        courseDuration: certificate.course.duration,
        pdfUrl: certificate.pdfUrl,
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
