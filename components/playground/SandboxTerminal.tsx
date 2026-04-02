"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TerminalLine {
  text: string;
  type: "stdout" | "stderr" | "system";
  timestamp: Date;
}

interface SandboxTerminalProps {
  lines: TerminalLine[];
  className?: string;
}

export function SandboxTerminal({ lines, className }: SandboxTerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  return (
    <div
      className={cn(
        "bg-zinc-950 text-zinc-100 font-mono text-sm overflow-y-auto p-3",
        className,
      )}
    >
      {lines.length === 0 && (
        <div className="text-zinc-500">
          Terminal ready. Click Run to execute code.
        </div>
      )}
      {lines.map((line, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-zinc-600 select-none shrink-0">
            {line.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
          <span
            className={cn(
              "whitespace-pre-wrap break-all",
              line.type === "stderr" && "text-red-400",
              line.type === "system" && "text-blue-400",
            )}
          >
            {line.text}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export type { TerminalLine };
