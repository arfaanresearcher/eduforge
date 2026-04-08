"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getMockCourseBySlug, type MockCourse } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Headphones,
  MessageSquare,
  Play,
  Plus,
  Sparkles,
  FileText,
  Loader2,
} from "lucide-react";

export default function NotebookPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;

  const [course, setCourse] = useState<MockCourse | null>(null);
  const [notebookId, setNotebookId] = useState<string | null>(null);
  const [notebookUrl, setNotebookUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [audioStatus, setAudioStatus] = useState<
    "idle" | "generating" | "ready"
  >("idle");
  const [notes, setNotes] = useState("");
  const [sourcesLoaded, setSourcesLoaded] = useState(0);
  const [episodeFocus, setEpisodeFocus] = useState("");
  const [showStudyGuide, setShowStudyGuide] = useState(false);

  useEffect(() => {
    const c = getMockCourseBySlug(courseSlug);
    if (c) setCourse(c);
  }, [courseSlug]);

  const totalSources =
    course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) ?? 0;

  async function handleCreateNotebook() {
    setIsCreating(true);
    try {
      const res = await fetch("/api/notebooklm/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setNotebookId(data.notebookId);
      setNotebookUrl(data.notebookUrl);
      setSourcesLoaded(data.sourcesLoaded ?? totalSources);
    } catch (err) {
      console.error("Failed to create notebook:", err);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleGenerateAudio() {
    if (!notebookId) return;
    setAudioStatus("generating");
    try {
      const res = await fetch("/api/notebooklm/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notebookId,
          episodeFocus: episodeFocus || undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAudioStatus("ready");
    } catch (err) {
      console.error("Failed to generate audio:", err);
      setAudioStatus("idle");
    }
  }

  const exampleQuestions = [
    "Summarize the key concepts from Module 1",
    "What are the prerequisites for this course?",
    "Create flashcards for the main topics",
  ];

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2
          className="h-8 w-8 animate-spin"
          style={{ color: "#2A8899" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Header ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {course.title}
          </h1>
          <Badge
            className="text-xs font-semibold px-3 py-1 rounded-full border-0"
            style={{
              background: "linear-gradient(135deg, #185C6B, #2A8899)",
              color: "#fff",
            }}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            AI Notebook
          </Badge>
        </div>
        <p className="text-sm text-white/60">
          Powered by Google NotebookLM
        </p>
      </div>

      {/* ── Action Bar ── */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleCreateNotebook}
          disabled={isCreating}
          className="rounded-xl font-medium"
          style={{
            background: notebookId
              ? "linear-gradient(135deg, #185C6B, #0D3B45)"
              : "linear-gradient(135deg, #2A8899, #185C6B)",
            color: "#fff",
            border: "1px solid rgba(42,136,153,0.3)",
          }}
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : notebookId ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Notebook Created
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Create Notebook
            </>
          )}
        </Button>

        {notebookUrl && (
          <a href={notebookUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="rounded-xl font-medium border-white/10 text-white hover:bg-white/5"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in NotebookLM
            </Button>
          </a>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Sources Panel ── */}
        <Card className="glass border-white/10 rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: "#2A8899" }} />
                Sources
              </h2>
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  background: "rgba(42,136,153,0.15)",
                  color: "#2A8899",
                }}
              >
                {notebookId ? sourcesLoaded : totalSources} sources
              </span>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {course.modules.map((mod) => (
                <div key={mod.id} className="space-y-1.5">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#C9956F" }}
                  >
                    {mod.title}
                  </p>
                  {mod.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-2 pl-3 py-1"
                    >
                      <CheckCircle2
                        className="h-3.5 w-3.5 flex-shrink-0"
                        style={{
                          color: notebookId
                            ? "#2A8899"
                            : "rgba(255,255,255,0.25)",
                        }}
                      />
                      <span className="text-sm text-white/70 truncate">
                        {lesson.title}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Audio Overview ── */}
        <Card className="glass border-white/10 rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Headphones className="h-5 w-5" style={{ color: "#C9956F" }} />
              Audio Overview
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Episode focus (optional)"
                value={episodeFocus}
                onChange={(e) => setEpisodeFocus(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#2A8899] transition-colors"
              />

              <Button
                onClick={handleGenerateAudio}
                disabled={!notebookId || audioStatus === "generating"}
                className="w-full rounded-xl font-medium"
                style={{
                  background:
                    audioStatus === "ready"
                      ? "linear-gradient(135deg, #185C6B, #0D3B45)"
                      : "linear-gradient(135deg, #C9956F, #a87a55)",
                  color: "#fff",
                  border: "1px solid rgba(201,149,111,0.3)",
                }}
              >
                {audioStatus === "generating" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : audioStatus === "ready" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Audio Ready
                  </>
                ) : (
                  <>
                    <Headphones className="h-4 w-4 mr-2" />
                    Generate Audio Overview
                  </>
                )}
              </Button>

              {/* Mock audio player */}
              {audioStatus === "ready" && (
                <div
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: "rgba(42,136,153,0.1)",
                    border: "1px solid rgba(42,136,153,0.2)",
                  }}
                >
                  <button
                    className="flex items-center justify-center w-9 h-9 rounded-full"
                    style={{ background: "#2A8899" }}
                  >
                    <Play className="h-4 w-4 text-white ml-0.5" />
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: "0%",
                          background:
                            "linear-gradient(90deg, #2A8899, #C9956F)",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-white/40">
                      <span>0:00</span>
                      <span>12:34</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Study Notes ── */}
        <Card className="glass border-white/10 rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5" style={{ color: "#2A8899" }} />
              Study Notes
            </h2>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your personal study notes here..."
              rows={5}
              className="w-full rounded-lg px-3 py-2 text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#2A8899] transition-colors resize-none"
            />

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!notebookId || !notes.trim()}
                className="rounded-lg border-white/10 text-white hover:bg-white/5 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add to Notebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!notebookId}
                onClick={() => setShowStudyGuide(!showStudyGuide)}
                className="rounded-lg border-white/10 text-white hover:bg-white/5 text-xs"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Generate Study Guide
              </Button>
            </div>

            {showStudyGuide && (
              <div
                className="rounded-xl p-4 space-y-3 text-sm"
                style={{
                  background: "rgba(24,92,107,0.1)",
                  border: "1px solid rgba(42,136,153,0.2)",
                }}
              >
                <p className="font-medium" style={{ color: "#2A8899" }}>
                  AI-Generated Study Guide
                </p>
                <ul className="space-y-2 text-white/70">
                  <li className="flex gap-2">
                    <span style={{ color: "#C9956F" }}>1.</span>
                    Review key definitions and terminology from each module
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9956F" }}>2.</span>
                    Practice the hands-on exercises in order of difficulty
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9956F" }}>3.</span>
                    Test yourself on the quiz questions before moving forward
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9956F" }}>4.</span>
                    Summarize each lesson in your own words
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: "#C9956F" }}>5.</span>
                    Connect concepts across modules to build a full picture
                  </li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── AI Chat Preview ── */}
        <Card className="glass border-white/10 rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MessageSquare
                className="h-5 w-5"
                style={{ color: "#C9956F" }}
              />
              AI Chat Preview
            </h2>

            <p className="text-sm text-white/60">
              Chat with your course materials in NotebookLM
            </p>

            {notebookUrl && (
              <a href={notebookUrl} target="_blank" rel="noopener noreferrer">
                <Button
                  className="w-full rounded-xl font-medium"
                  style={{
                    background: "linear-gradient(135deg, #2A8899, #185C6B)",
                    color: "#fff",
                    border: "1px solid rgba(42,136,153,0.3)",
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open NotebookLM Chat
                </Button>
              </a>
            )}

            <div className="space-y-2">
              <p className="text-xs text-white/40 uppercase tracking-wider">
                Example questions
              </p>
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((q) => (
                  <button
                    key={q}
                    className="text-xs px-3 py-1.5 rounded-full text-white/70 hover:text-white transition-colors cursor-pointer"
                    style={{
                      background: "rgba(42,136,153,0.1)",
                      border: "1px solid rgba(42,136,153,0.2)",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
