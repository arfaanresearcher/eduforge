"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, ArrowRight, Check, BookOpen, Rocket } from "lucide-react";
import { MOCK_COURSES } from "@/lib/mock-data";

const INTEREST_TAGS = [
  "AI", "Web Dev", "Data Science", "Product", "Design", "Mobile", "Cloud", "Security",
];

const FEATURED_COURSES = MOCK_COURSES.slice(0, 3);

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const totalSteps = 4;

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function next() {
    if (step < totalSteps - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      {/* Progress bar */}
      <div className="mb-8 flex w-full max-w-xl items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= step
                ? "bg-gradient-to-r from-cyan-500 to-purple-600"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        {/* Step 1: Welcome */}
        {step === 0 && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">Welcome to EduForge</h1>
            <p className="text-muted-foreground">
              Let&apos;s personalize your learning experience. This will only take a moment.
            </p>
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 1 && (
          <div>
            <h2 className="mb-2 text-2xl font-bold">What interests you?</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Select topics you&apos;d like to explore. Pick as many as you like.
            </p>
            <div className="flex flex-wrap gap-3">
              {INTEREST_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {selectedTags.includes(tag) && <Check className="mr-1.5 inline h-3.5 w-3.5" />}
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Pick a course */}
        {step === 2 && (
          <div>
            <h2 className="mb-2 text-2xl font-bold">Pick your first course</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Choose a course to get started with, or skip and browse later.
            </p>
            <div className="space-y-3">
              {FEATURED_COURSES.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)}
                  className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                    selectedCourse === course.id
                      ? "border-cyan-500/50 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20">
                    <BookOpen className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {course.description}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-muted-foreground">
                        {course.level}
                      </span>
                      <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-muted-foreground">
                        {course.duration}h
                      </span>
                    </div>
                  </div>
                  {selectedCourse === course.id && (
                    <Check className="ml-auto mt-1 h-5 w-5 shrink-0 text-cyan-400" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: All set */}
        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">You&apos;re all set!</h1>
            <p className="mb-4 text-muted-foreground">
              Your personalized learning path is ready. Let&apos;s start building your future.
            </p>
            {/* Confetti-like decorative dots */}
            <div className="relative mx-auto mb-6 h-8 w-48">
              {[
                "bg-cyan-400", "bg-purple-500", "bg-pink-400", "bg-green-400",
                "bg-yellow-400", "bg-blue-400", "bg-orange-400", "bg-emerald-400",
              ].map((color, i) => (
                <div
                  key={i}
                  className={`absolute h-2 w-2 rounded-full ${color} animate-pulse`}
                  style={{
                    left: `${(i / 8) * 100}%`,
                    top: `${Math.sin(i * 0.8) * 12 + 12}px`,
                    animationDelay: `${i * 150}ms`,
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => router.push("/learn")}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:shadow-[0_0_24px_rgba(6,182,212,0.4)]"
            >
              Start Learning
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex w-full max-w-xl items-center justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-white disabled:invisible"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* Step dots */}
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 bg-gradient-to-r from-cyan-500 to-purple-600"
                  : "w-2 bg-white/20"
              }`}
            />
          ))}
        </div>

        {step < totalSteps - 1 ? (
          <button
            onClick={next}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-20" />
        )}
      </div>
    </div>
  );
}
