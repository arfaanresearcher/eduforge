"use client";

import { useRef, useCallback, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onRun?: () => void;
}

const LANG_MAP: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  go: "go",
  json: "json",
  md: "markdown",
  css: "css",
  html: "html",
};

export function getLanguageFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return LANG_MAP[ext] ?? "plaintext";
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  onRun,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Ctrl+Enter = run code
    editor.addAction({
      id: "run-code",
      label: "Run Code",
      keybindings: [2048 | 3], // Ctrl+Enter
      run: () => onRun?.(),
    });
  };

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        onChange(newValue ?? "");
      }, 300);
    },
    [onChange],
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme={resolvedTheme === "dark" ? "vs-dark" : "vs-light"}
      onChange={handleChange}
      onMount={handleEditorMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: "on",
      }}
    />
  );
}
