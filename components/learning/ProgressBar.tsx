"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  showLabel = true,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const color =
    clamped >= 70
      ? "bg-green-500"
      : clamped >= 30
        ? "bg-blue-500"
        : "bg-gray-400";

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", color)}
            style={{ width: `${clamped}%` }}
          />
        </div>
        {showLabel && (
          <span className="text-xs font-medium tabular-nums min-w-[3ch]">
            {Math.round(clamped)}%
          </span>
        )}
      </div>
    </div>
  );
}
