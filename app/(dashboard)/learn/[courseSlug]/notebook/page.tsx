"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getMockCourseBySlug, type MockCourse } from "@/lib/mock-data";

type Tab = "chat" | "study-guide" | "flashcards" | "documents" | "notebooklm";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Flashcard {
  front: string;
  back: string;
}

export default function NotebookPage() {
  const params = useParams();
  const courseSlug = params.courseSlug as string;

  const [course, setCourse] = useState<MockCourse | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Study guide state
  const [studyGuide, setStudyGuide] = useState<string | null>(null);
  const [guideLoading, setGuideLoading] = useState(false);

  // Flashcards state
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);

  // Documents state
  const [docResult, setDocResult] = useState<string>("");
  const [docFileName, setDocFileName] = useState<string>("");
  const [docLoading, setDocLoading] = useState(false);
  const [docAction, setDocAction] = useState<string>("summarize");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const c = getMockCourseBySlug(courseSlug);
    if (c) setCourse(c);
  }, [courseSlug]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Chat ---
  async function sendMessage(text?: string) {
    const msg = text ?? chatInput.trim();
    if (!msg) return;
    setChatInput("");

    const userMsg: ChatMessage = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/notebooklm/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, message: msg }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  // --- Study Guide ---
  async function handleGenerateGuide() {
    setGuideLoading(true);
    try {
      const res = await fetch("/api/notebooklm/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, tool: "study-guide" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStudyGuide(data.result);
    } catch (err) {
      console.error(err);
      setStudyGuide("Failed to generate study guide. Please try again.");
    } finally {
      setGuideLoading(false);
    }
  }

  // --- Flashcards ---
  async function handleGenerateFlashcards() {
    setFlashcardsLoading(true);
    try {
      const res = await fetch("/api/notebooklm/audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, tool: "flashcards" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFlashcards(data.result);
      setFlashcardIndex(0);
      setFlashcardFlipped(false);
    } catch (err) {
      console.error(err);
    } finally {
      setFlashcardsLoading(false);
    }
  }

  // --- Document Upload ---
  async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocLoading(true);
    setDocFileName(file.name);
    setDocResult("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("action", docAction);
      const res = await fetch("/api/notebooklm/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDocResult(data.result);
    } catch (err) {
      setDocResult(`Error: ${err instanceof Error ? err.message : "Upload failed"}`);
    } finally {
      setDocLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // --- Render helpers ---
  function renderFormattedText(text: string) {
    return text.split("\n").map((line, i) => {
      // Bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={j} style={{ color: "#C9956F" }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={j}>{part}</span>;
      });
      return (
        <div key={i} className={line === "" ? "h-3" : ""}>
          {parts}
        </div>
      );
    });
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "chat", label: "AI Chat" },
    { id: "study-guide", label: "Study Guide" },
    { id: "flashcards", label: "Flashcards" },
    { id: "documents", label: "Documents" },
    { id: "notebooklm", label: "NotebookLM" },
  ];

  const quickChips = [
    "Summarize this course",
    "Generate flashcards",
    "Quiz me on key concepts",
  ];

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: "#2A8899", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* ── Header ── */}
      <div className="space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {course.title}
          </h1>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: "linear-gradient(135deg, #185C6B, #2A8899)",
              color: "#fff",
            }}
          >
            AI Study Hub
          </span>
        </div>
        <p className="text-sm text-white/50">
          Powered by Gemini + NotebookLM
        </p>
      </div>

      {/* ── Tab Buttons ── */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background:
                activeTab === tab.id
                  ? "linear-gradient(135deg, #C9956F, #a87a55)"
                  : "rgba(255,255,255,0.05)",
              color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.6)",
              border:
                activeTab === tab.id
                  ? "1px solid rgba(201,149,111,0.4)"
                  : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* TAB 1: AI Chat                              */}
      {/* ════════════════════════════════════════════ */}
      {activeTab === "chat" && (
        <div
          className="glass neon-border rounded-2xl flex flex-col"
          style={{ minHeight: 480, maxHeight: "70vh", border: "1px solid rgba(42,136,153,0.2)" }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(42,136,153,0.15)" }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2A8899"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-white/50 text-sm text-center">
                  Ask anything about your course materials
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {quickChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="text-xs px-3 py-1.5 rounded-full transition-colors hover:text-white"
                      style={{
                        background: "rgba(42,136,153,0.12)",
                        border: "1px solid rgba(42,136,153,0.25)",
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background:
                      msg.role === "user"
                        ? "rgba(201,149,111,0.15)"
                        : "rgba(42,136,153,0.12)",
                    border:
                      msg.role === "user"
                        ? "1px solid rgba(201,149,111,0.25)"
                        : "1px solid rgba(42,136,153,0.2)",
                    color: "rgba(255,255,255,0.88)",
                  }}
                >
                  {renderFormattedText(msg.content)}
                </div>
              </div>
            ))}

            {chatLoading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl px-4 py-3 text-sm"
                  style={{
                    background: "rgba(42,136,153,0.12)",
                    border: "1px solid rgba(42,136,153,0.2)",
                  }}
                >
                  <div className="flex gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "#2A8899", animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "#2A8899", animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "#2A8899", animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div
            className="p-3 border-t"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex gap-2">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about your course..."
                rows={1}
                className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none transition-colors resize-none"
                style={{ borderColor: "rgba(42,136,153,0.3)" }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!chatInput.trim() || chatLoading}
                className="px-4 rounded-xl text-sm font-medium transition-opacity disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #2A8899, #185C6B)",
                  color: "#fff",
                  border: "1px solid rgba(42,136,153,0.3)",
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* TAB 2: Study Guide                          */}
      {/* ════════════════════════════════════════════ */}
      {activeTab === "study-guide" && (
        <div
          className="glass neon-border rounded-2xl p-6 space-y-4"
          style={{ border: "1px solid rgba(42,136,153,0.2)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2A8899"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Study Guide
            </h2>
            <button
              onClick={handleGenerateGuide}
              disabled={guideLoading}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #2A8899, #185C6B)",
                color: "#fff",
                border: "1px solid rgba(42,136,153,0.3)",
              }}
            >
              {guideLoading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent inline-block"
                    style={{ borderColor: "#fff", borderTopColor: "transparent" }}
                  />
                  Generating...
                </span>
              ) : studyGuide ? (
                "Regenerate"
              ) : (
                "Generate Study Guide"
              )}
            </button>
          </div>

          {studyGuide && (
            <div
              className="rounded-xl p-5 text-sm leading-relaxed"
              style={{
                background: "rgba(24,92,107,0.1)",
                border: "1px solid rgba(42,136,153,0.2)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {renderFormattedText(studyGuide)}
            </div>
          )}

          {!studyGuide && !guideLoading && (
            <p className="text-sm text-white/40 text-center py-8">
              Click &quot;Generate Study Guide&quot; to create a comprehensive study guide for this course.
            </p>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* TAB 3: Flashcards                           */}
      {/* ════════════════════════════════════════════ */}
      {activeTab === "flashcards" && (
        <div
          className="glass neon-border rounded-2xl p-6 space-y-6"
          style={{ border: "1px solid rgba(42,136,153,0.2)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C9956F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Flashcards
            </h2>
            <button
              onClick={handleGenerateFlashcards}
              disabled={flashcardsLoading}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #C9956F, #a87a55)",
                color: "#fff",
                border: "1px solid rgba(201,149,111,0.3)",
              }}
            >
              {flashcardsLoading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent inline-block"
                    style={{ borderColor: "#fff", borderTopColor: "transparent" }}
                  />
                  Generating...
                </span>
              ) : flashcards.length > 0 ? (
                "Regenerate"
              ) : (
                "Generate Flashcards"
              )}
            </button>
          </div>

          {flashcards.length > 0 && (
            <>
              {/* Card */}
              <div
                onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                className="cursor-pointer rounded-2xl p-8 text-center transition-all min-h-[200px] flex flex-col items-center justify-center"
                style={{
                  background: flashcardFlipped
                    ? "rgba(201,149,111,0.1)"
                    : "rgba(42,136,153,0.1)",
                  border: flashcardFlipped
                    ? "1px solid rgba(201,149,111,0.3)"
                    : "1px solid rgba(42,136,153,0.3)",
                }}
              >
                <p
                  className="text-xs uppercase tracking-wider mb-3"
                  style={{
                    color: flashcardFlipped
                      ? "rgba(201,149,111,0.7)"
                      : "rgba(42,136,153,0.7)",
                  }}
                >
                  {flashcardFlipped ? "Answer" : "Question"} — tap to flip
                </p>
                <p className="text-lg text-white font-medium leading-relaxed">
                  {flashcardFlipped
                    ? flashcards[flashcardIndex].back
                    : flashcards[flashcardIndex].front}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setFlashcardIndex((prev) => Math.max(0, prev - 1));
                    setFlashcardFlipped(false);
                  }}
                  disabled={flashcardIndex === 0}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity disabled:opacity-30"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Previous
                </button>
                <span className="text-sm text-white/50">
                  {flashcardIndex + 1} / {flashcards.length}
                </span>
                <button
                  onClick={() => {
                    setFlashcardIndex((prev) =>
                      Math.min(flashcards.length - 1, prev + 1)
                    );
                    setFlashcardFlipped(false);
                  }}
                  disabled={flashcardIndex === flashcards.length - 1}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-opacity disabled:opacity-30"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {flashcards.length === 0 && !flashcardsLoading && (
            <p className="text-sm text-white/40 text-center py-8">
              Click &quot;Generate Flashcards&quot; to create study flashcards from your course content.
            </p>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* TAB 4: Documents                             */}
      {/* ════════════════════════════════════════════ */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className="glass neon-border rounded-2xl p-6 space-y-5"
            style={{ border: "1px solid rgba(42,136,153,0.2)" }}
          >
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9956F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              Upload &amp; Analyze Document
            </h2>
            <p className="text-sm text-white/60">
              Upload any PDF, DOCX, TXT, or MD file and let AI analyze it for you.
            </p>

            {/* Action Selector */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "summarize", label: "Summarize" },
                { id: "study-guide", label: "Study Guide" },
                { id: "flashcards", label: "Flashcards" },
                { id: "key-points", label: "Key Points" },
                { id: "explain", label: "Explain Simply" },
              ].map((action) => (
                <button
                  key={action.id}
                  onClick={() => setDocAction(action.id)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: docAction === action.id
                      ? "linear-gradient(135deg, #C9956F, #a87a55)"
                      : "rgba(255,255,255,0.05)",
                    color: docAction === action.id ? "#fff" : "rgba(255,255,255,0.6)",
                    border: docAction === action.id
                      ? "1px solid rgba(201,149,111,0.4)"
                      : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl p-8 text-center cursor-pointer transition-all hover:border-opacity-40"
              style={{
                border: "2px dashed rgba(42,136,153,0.3)",
                background: "rgba(42,136,153,0.05)",
              }}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = e.dataTransfer.files[0];
                if (file && fileInputRef.current) {
                  const dt = new DataTransfer();
                  dt.items.add(file);
                  fileInputRef.current.files = dt.files;
                  fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md,.csv"
                onChange={handleDocUpload}
                className="hidden"
              />
              <svg className="mx-auto mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2A8899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-white/80 font-medium">
                {docLoading ? "Processing..." : "Click or drop a file here"}
              </p>
              <p className="text-xs text-white/40 mt-1">
                PDF, DOCX, TXT, MD, CSV — up to 10MB
              </p>
            </div>

            {/* Loading */}
            {docLoading && (
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(42,136,153,0.1)", border: "1px solid rgba(42,136,153,0.2)" }}>
                <div className="animate-spin h-5 w-5 rounded-full border-2 border-white/20" style={{ borderTopColor: "#C9956F" }} />
                <span className="text-sm text-white/70">Analyzing <strong className="text-white/90">{docFileName}</strong>...</span>
              </div>
            )}
          </div>

          {/* Results */}
          {docResult && !docLoading && (
            <div
              className="glass neon-border rounded-2xl p-6 space-y-4"
              style={{ border: "1px solid rgba(201,149,111,0.2)" }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9956F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {docFileName}
                </h3>
                <button
                  onClick={() => { setDocResult(""); setDocFileName(""); }}
                  className="text-xs px-3 py-1 rounded-lg text-white/50 hover:text-white/80"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  Clear
                </button>
              </div>
              <div
                className="rounded-xl p-5 text-sm text-white/80 leading-relaxed overflow-auto max-h-[600px]"
                style={{ background: "rgba(13,59,69,0.5)", border: "1px solid rgba(42,136,153,0.1)" }}
              >
                {renderFormattedText(docResult)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* TAB 5: NotebookLM                           */}
      {/* ════════════════════════════════════════════ */}
      {activeTab === "notebooklm" && (
        <div
          className="glass neon-border rounded-2xl p-6 space-y-6"
          style={{ border: "1px solid rgba(42,136,153,0.2)" }}
        >
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2A8899"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Google NotebookLM
            </h2>
            <p className="text-sm text-white/60">
              Upload your course materials to Google&apos;s free AI notebook tool for deep Q&amp;A, audio overviews, and more.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <a
              href={`/api/notebooklm/status?courseSlug=${courseSlug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity"
              style={{
                background: "linear-gradient(135deg, #C9956F, #a87a55)",
                color: "#fff",
                border: "1px solid rgba(201,149,111,0.3)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Course Notes
            </a>
            <a
              href="https://notebooklm.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity"
              style={{
                background: "linear-gradient(135deg, #2A8899, #185C6B)",
                color: "#fff",
                border: "1px solid rgba(42,136,153,0.3)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Open NotebookLM
            </a>
          </div>

          {/* Steps */}
          <div
            className="rounded-xl p-5 space-y-4"
            style={{
              background: "rgba(24,92,107,0.08)",
              border: "1px solid rgba(42,136,153,0.15)",
            }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "#C9956F" }}
            >
              How to use
            </p>
            <ol className="space-y-3 text-sm text-white/70">
              <li className="flex gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(201,149,111,0.2)", color: "#C9956F" }}
                >
                  1
                </span>
                <span>
                  Click <strong className="text-white/90">&quot;Download Course Notes&quot;</strong> to get a text file with all your course materials.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(201,149,111,0.2)", color: "#C9956F" }}
                >
                  2
                </span>
                <span>
                  Go to <strong className="text-white/90">notebooklm.google.com</strong> and create a new notebook.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(201,149,111,0.2)", color: "#C9956F" }}
                >
                  3
                </span>
                <span>
                  Upload the downloaded file as a source.
                </span>
              </li>
              <li className="flex gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(201,149,111,0.2)", color: "#C9956F" }}
                >
                  4
                </span>
                <span>
                  Start chatting with your course materials, generate audio overviews, and more!
                </span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
