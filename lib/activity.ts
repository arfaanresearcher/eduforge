import { db } from "./db";

export const LESSON_COMPLETED = "lesson.completed";
export const COURSE_ENROLLED = "course.enrolled";
export const PROTOTYPE_CREATED = "prototype.created";
export const RECOMMENDATION_VIEWED = "recommendation.viewed";
export const RECOMMENDATION_FEEDBACK = "recommendation.feedback";
export const SANDBOX_STARTED = "sandbox.started";
export const CERTIFICATE_ISSUED = "certificate.issued";

export function logEvent(
  userId: string,
  eventType: string,
  metadata?: Record<string, unknown>,
): void {
  // Fire and forget — don't block the caller
  db.activityEvent
    .create({
      data: {
        userId,
        eventType,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    })
    .catch((error) => {
      console.error("Failed to log activity event:", error);
    });
}
