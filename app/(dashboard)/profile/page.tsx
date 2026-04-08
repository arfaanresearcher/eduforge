"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  ExternalLink,
  Target,
  Calendar,
  TrendingUp,
} from "lucide-react";
import {
  MOCK_USER,
  MOCK_ENROLLMENTS,
  MOCK_CERTIFICATES,
  MOCK_COURSES,
} from "@/lib/mock-data";

const TABS = ["Overview", "Certificates", "Activity"] as const;
type Tab = (typeof TABS)[number];

const enrolledCourses = MOCK_ENROLLMENTS.map((enrollment) => {
  const course = MOCK_COURSES.find((c) => c.id === enrollment.courseId);
  return { ...enrollment, course };
});

const mockActivity = [
  { action: "Completed lesson: Neural Network Fundamentals", time: "2 hours ago", icon: CheckCircle2 },
  { action: "Started module: Deep Learning and Deployment", time: "3 hours ago", icon: BookOpen },
  { action: "Earned certificate: Python for Data Science", time: "2 days ago", icon: Award },
  { action: "Enrolled in Full-Stack Web Development", time: "1 week ago", icon: TrendingUp },
  { action: "Completed Python for Data Science", time: "2 weeks ago", icon: CheckCircle2 },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const completedCount = MOCK_ENROLLMENTS.filter((e) => e.status === "COMPLETED").length;
  const totalHours = enrolledCourses.reduce((sum, e) => sum + (e.course?.duration ?? 0), 0);

  return (
    <div className="space-y-6 p-6">
      {/* Profile header */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-bold text-white shadow-lg" style={{ background: 'linear-gradient(to bottom right, #185C6B, #C9956F)' }}>
            AR
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold">{MOCK_USER.name}</h1>
            <p className="text-sm text-muted-foreground">{MOCK_USER.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'rgba(24,92,107,0.15)', color: '#2A8899' }}>
                {MOCK_USER.role}
              </span>
              {MOCK_USER.careerGoal && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  {MOCK_USER.careerGoal}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-white/10 text-white"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl text-center">
              <BookOpen className="mx-auto mb-2 h-6 w-6" style={{ color: '#2A8899' }} />
              <p className="text-2xl font-bold">{MOCK_ENROLLMENTS.length}</p>
              <p className="text-xs text-muted-foreground">Courses Enrolled</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl text-center">
              <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-green-400" />
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl text-center">
              <Clock className="mx-auto mb-2 h-6 w-6" style={{ color: '#C9956F' }} />
              <p className="text-2xl font-bold">{totalHours}h</p>
              <p className="text-xs text-muted-foreground">Total Hours</p>
            </div>
          </div>

          {/* Enrolled courses */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-semibold">Enrolled Courses</h2>
            <div className="space-y-4">
              {enrolledCourses.map((enrollment) => (
                <div
                  key={enrollment.courseId}
                  className="flex flex-col gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{enrollment.course?.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {enrollment.course?.level} &middot; {enrollment.course?.duration}h
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:w-48">
                    <div className="flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ background: 'linear-gradient(to right, #185C6B, #C9956F)' }}
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium tabular-nums">
                      {enrollment.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certificates tab */}
      {activeTab === "Certificates" && (
        <div className="space-y-4">
          {MOCK_CERTIFICATES.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
              <Award className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">No certificates earned yet.</p>
            </div>
          ) : (
            MOCK_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20">
                    <Award className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cert.courseTitle}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Issued to {cert.recipientName}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/verify/${cert.uniqueId}`}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
                >
                  View
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Activity tab */}
      {activeTab === "Activity" && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <div className="relative space-y-0">
            {mockActivity.map((item, i) => (
              <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Timeline line */}
                {i < mockActivity.length - 1 && (
                  <div className="absolute left-[15px] top-8 h-full w-px bg-white/10" />
                )}
                {/* Icon */}
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <item.icon className="h-4 w-4" style={{ color: '#2A8899' }} />
                </div>
                {/* Content */}
                <div className="pt-1">
                  <p className="text-sm">{item.action}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
