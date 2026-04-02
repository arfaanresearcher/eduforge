"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CodeEditor,
  getLanguageFromFilename,
} from "@/components/playground/CodeEditor";
import {
  SandboxTerminal,
  type TerminalLine,
} from "@/components/playground/SandboxTerminal";
import { FileTree, type FileNode } from "@/components/playground/FileTree";
import { Play, Save, Trash2, Send, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_FILES: FileNode[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    children: [
      { name: "index.js", type: "file", path: "src/index.js" },
      { name: "utils.js", type: "file", path: "src/utils.js" },
    ],
  },
  { name: "package.json", type: "file", path: "package.json" },
  { name: "README.md", type: "file", path: "README.md" },
];

const DEFAULT_CODE: Record<string, string> = {
  "src/index.js": `// Welcome to EduForge Playground!\nconsole.log("Hello from EduForge!");\n\n// Try writing some code and click Run (or Ctrl+Enter)\nconst fibonacci = (n) => {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n};\n\nfor (let i = 0; i < 10; i++) {\n  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);\n}`,
  "src/utils.js": `// Utility functions\nexport function formatDate(date) {\n  return new Date(date).toLocaleDateString();\n}\n\nexport function capitalize(str) {\n  return str.charAt(0).toUpperCase() + str.slice(1);\n}`,
  "package.json": `{\n  "name": "prototype",\n  "version": "1.0.0",\n  "main": "src/index.js"\n}`,
  "README.md": "# My Prototype\n\nBuilt with EduForge Playground",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function SandboxPage() {
  const params = useParams();
  const prototypeId = params.prototypeId as string;

  const [selectedFile, setSelectedFile] = useState("src/index.js");
  const [fileContents, setFileContents] = useState(DEFAULT_CODE);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [sandboxStatus, setSandboxStatus] = useState<string>("starting");
  const [running, setRunning] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Initialize sandbox
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/sandbox/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prototypeId,
            techStack: ["Node.js"],
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setSandboxId(data.sandboxId);
          setSandboxStatus("running");
          addTerminalLine("Sandbox ready.", "system");
        } else {
          setSandboxStatus("error");
          addTerminalLine("Failed to create sandbox.", "stderr");
        }
      } catch {
        setSandboxStatus("error");
        addTerminalLine("Sandbox service unavailable.", "stderr");
      }
    }
    init();
  }, [prototypeId]);

  const addTerminalLine = (text: string, type: TerminalLine["type"]) => {
    setTerminalLines((prev) => [...prev, { text, type, timestamp: new Date() }]);
  };

  const handleRun = useCallback(async () => {
    if (!sandboxId || running) return;
    setRunning(true);
    addTerminalLine(`Running ${selectedFile}...`, "system");

    try {
      const res = await fetch(`/api/sandbox/${sandboxId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: fileContents[selectedFile] ?? "",
          language: getLanguageFromFilename(selectedFile),
        }),
      });

      const data = await res.json();
      if (data.stdout) addTerminalLine(data.stdout, "stdout");
      if (data.stderr) addTerminalLine(data.stderr, "stderr");
      addTerminalLine(`Exit code: ${data.exitCode}`, "system");
    } catch {
      addTerminalLine("Execution failed.", "stderr");
    } finally {
      setRunning(false);
    }
  }, [sandboxId, running, selectedFile, fileContents]);

  const handleDestroy = async () => {
    if (!sandboxId) return;
    await fetch(`/api/sandbox/${sandboxId}/destroy`, { method: "DELETE" });
    setSandboxStatus("stopped");
    addTerminalLine("Sandbox destroyed.", "system");
  };

  const handleCodeChange = (value: string) => {
    setFileContents((prev) => ({ ...prev, [selectedFile]: value }));
  };

  const sendChat = useCallback(async () => {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "builder",
          contextId: prototypeId,
          message: msg,
          history: chatMessages,
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) return;

      let assistantMsg = "";
      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        const lines = text.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            assistantMsg += parsed.text;
            setChatMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: assistantMsg,
              };
              return updated;
            });
          } catch {}
        }
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble connecting. Please try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, prototypeId, chatMessages]);

  const language = getLanguageFromFilename(selectedFile);

  return (
    <div className="flex h-full">
      {/* File tree */}
      <aside className="w-56 border-r overflow-y-auto bg-muted/20">
        <div className="p-3 border-b text-xs font-semibold uppercase text-muted-foreground">
          Files
        </div>
        <FileTree
          files={DEFAULT_FILES}
          selectedPath={selectedFile}
          onSelect={setSelectedFile}
        />
      </aside>

      {/* Editor + Terminal */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b px-4 py-2 flex items-center gap-3">
          <Button size="sm" onClick={handleRun} disabled={running || sandboxStatus !== "running"}>
            <Play className="h-4 w-4 mr-1" />
            {running ? "Running..." : "Run"}
          </Button>
          <Button size="sm" variant="outline">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDestroy}>
            <Trash2 className="h-4 w-4 mr-1" />
            Destroy
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                sandboxStatus === "running" ? "bg-green-500" : "bg-gray-400",
              )}
            />
            <span className="text-xs text-muted-foreground">{sandboxStatus}</span>
            <Badge variant="outline" className="text-xs">
              {language}
            </Badge>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-0">
          <CodeEditor
            value={fileContents[selectedFile] ?? ""}
            onChange={handleCodeChange}
            language={language}
            onRun={handleRun}
          />
        </div>

        {/* Terminal */}
        <div className="h-48 border-t">
          <SandboxTerminal lines={terminalLines} className="h-full" />
        </div>
      </div>

      {/* Builder AI chat */}
      <div
        className={cn(
          "border-l bg-muted/20 flex flex-col transition-all",
          chatOpen ? "w-80" : "w-0",
        )}
      >
        {chatOpen && (
          <>
            <div className="p-3 border-b flex items-center justify-between">
              <span className="font-semibold text-sm">Builder AI</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChatOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Ask for help with your code
                </p>
              )}
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "text-sm rounded-lg px-3 py-2 max-w-[90%]",
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted",
                  )}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Ask about your code..."
                className="flex-1 text-sm px-3 py-2 rounded-md border bg-background"
              />
              <Button size="sm" onClick={sendChat} disabled={chatLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageSquare className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
