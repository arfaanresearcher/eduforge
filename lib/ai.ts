import Anthropic from "@anthropic-ai/sdk";
import { db } from "./db";
import { RecommendationType } from "@prisma/client";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface RecommendationItem {
  title: string;
  description: string;
  reason: string;
  type: "course" | "skill" | "project" | "resource";
  priority: "high" | "medium" | "low";
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function getLearnerRecommendations(
  userId: string,
): Promise<RecommendationItem[]> {
  try {
    const user = await db.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        enrollments: { include: { course: true } },
        activityEvents: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    const context = `
User: ${user.name}
Career Goal: ${user.careerGoal ?? "Not specified"}
Bio: ${user.bio ?? "None"}
Enrolled Courses: ${user.enrollments.map((e) => `${e.course.title} (${Math.round(e.progress)}% complete)`).join(", ") || "None"}
Recent Activity: ${user.activityEvents.map((a) => a.eventType).join(", ") || "None"}
    `.trim();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an AI learning advisor. Based on this learner profile, provide 5 personalized recommendations. Return ONLY valid JSON array.

${context}

Return JSON array of objects with: title, description, reason, type (course|skill|project|resource), priority (high|medium|low)`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const items: RecommendationItem[] = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : [];

    await db.recommendation.create({
      data: {
        userId,
        type: RecommendationType.LEARNER,
        payload: items as unknown as Parameters<typeof db.recommendation.create>[0]["data"]["payload"],
        context: { profile: context },
      },
    });

    return items;
  } catch (error) {
    console.error("Failed to get learner recommendations:", error);
    return [
      {
        title: "Complete your current courses",
        description:
          "Focus on finishing courses you have already started to build momentum.",
        reason: "Completing courses builds a strong foundation.",
        type: "course",
        priority: "high",
      },
    ];
  }
}

export async function getBuilderRecommendations(
  userId: string,
  prototypeId: string,
): Promise<RecommendationItem[]> {
  try {
    const [user, prototype] = await Promise.all([
      db.user.findUniqueOrThrow({ where: { id: userId } }),
      db.prototype.findUniqueOrThrow({ where: { id: prototypeId } }),
    ]);

    const context = `
User: ${user.name}, Company: ${user.company ?? "Independent"}
Prototype: ${prototype.title}
Description: ${prototype.description ?? "None"}
Tech Stack: ${prototype.techStack.join(", ")}
Status: ${prototype.status}
    `.trim();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an AI technical advisor. Based on this prototype context, provide 5 recommendations for improving and extending it. Return ONLY valid JSON array.

${context}

Return JSON array of objects with: title, description, reason, type (course|skill|project|resource), priority (high|medium|low)`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const items: RecommendationItem[] = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : [];

    await db.recommendation.create({
      data: {
        userId,
        type: RecommendationType.BUILDER,
        payload: items as unknown as Parameters<typeof db.recommendation.create>[0]["data"]["payload"],
        context: { prototype: context },
      },
    });

    return items;
  } catch (error) {
    console.error("Failed to get builder recommendations:", error);
    return [
      {
        title: "Add automated tests",
        description:
          "Write unit and integration tests for your core functionality.",
        reason: "Tests catch bugs early and enable confident refactoring.",
        type: "skill",
        priority: "high",
      },
    ];
  }
}

export function streamLessonChat(
  lessonContent: string,
  userMessage: string,
  history: Message[],
): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = anthropic.messages.stream({
          model: "claude-sonnet-4-5-20250514",
          max_tokens: 2048,
          system: `You are an AI tutor helping a student understand lesson material. Be encouraging, clear, and use examples. Here is the lesson content for context:\n\n${lessonContent.slice(0, 4000)}`,
          messages: [
            ...history.map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
            { role: "user" as const, content: userMessage },
          ],
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`),
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Lesson chat stream error:", error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ text: "I'm having trouble connecting right now. Please try again." })}\n\n`,
          ),
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });
}

export function streamBuilderChat(
  prototypeContext: string,
  userMessage: string,
  history: Message[],
): ReadableStream {
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        const stream = anthropic.messages.stream({
          model: "claude-sonnet-4-5-20250514",
          max_tokens: 4096,
          system: `You are an AI coding assistant helping a developer build their prototype. Be precise and provide working code examples. Here is the prototype context:\n\n${prototypeContext.slice(0, 4000)}`,
          messages: [
            ...history.map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
            { role: "user" as const, content: userMessage },
          ],
        });

        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`),
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Builder chat stream error:", error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ text: "I'm having trouble connecting right now. Please try again." })}\n\n`,
          ),
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });
}
