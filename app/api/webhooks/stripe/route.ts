import { NextRequest, NextResponse } from "next/server";
import { handleWebhookEvent } from "@/lib/stripe";
import { db } from "@/lib/db";
import { EnrollmentStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = await handleWebhookEvent(body, signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const courseId = session.metadata?.courseId;

      if (userId && courseId) {
        await db.$transaction([
          db.enrollment.upsert({
            where: { userId_courseId: { userId, courseId } },
            update: { status: EnrollmentStatus.ACTIVE },
            create: { userId, courseId, status: EnrollmentStatus.ACTIVE },
          }),
          db.payment.create({
            data: {
              userId,
              stripePaymentId: session.payment_intent as string,
              amount: (session.amount_total ?? 0) / 100,
              currency: session.currency ?? "usd",
              status: "completed",
              metadata: { courseId, sessionId: session.id },
            },
          }),
        ]);
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object;
      const payment = await db.payment.findUnique({
        where: { stripePaymentId: charge.payment_intent as string },
      });

      if (payment) {
        const enrollment = await db.enrollment.findFirst({
          where: { userId: payment.userId },
        });

        if (enrollment) {
          const daysSinceEnrollment = Math.floor(
            (Date.now() - enrollment.createdAt.getTime()) / (1000 * 60 * 60 * 24),
          );

          if (daysSinceEnrollment <= 7 && enrollment.progress < 20) {
            await db.enrollment.update({
              where: { id: enrollment.id },
              data: { status: EnrollmentStatus.REFUNDED },
            });
          }
        }

        await db.payment.update({
          where: { id: payment.id },
          data: { status: "refunded" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
