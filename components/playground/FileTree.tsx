"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, File, Folder } from "lucide-react";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  path: string;
}

interface FileTreeProps {
  files: FileNode[];
  selectedPath?: string;
  onSelect: (path: string) => void;
}

export function FileTree({ files, selectedPath, onSelect }: FileTreeProps) {
  return (
    <div className="text-sm py-1">
      {files.map((node) => (
        <TreeNode
          key={node.path}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  depth,
  selectedPath,
  onSelect,
}: {
  node: FileNode;
  depth: number;
  selectedPath?: string;
  onSelect: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);

  if (node.type === "folder") {
    return (
      <div>
        <button
          className="flex items-center gap-1 w-full px-2 py-1 hover:bg-muted rounded-sm"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronRight
            className={cn(
              "h-3 w-3 transition-transform",
              expanded && "rotate-90",
            )}
          />
          <Folder className="h-4 w-4 text-blue-400" />
          <span>{node.name}</span>
        </button>
        {expanded &&
          node.children?.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
      </div>
    );
  }

  return (
    <button
      className={cn(
        "flex items-center gap-1 w-full px-2 py-1 rounded-sm",
        selectedPath === node.path ? "bg-primary/10 text-primary" : "hover:bg-muted",
      )}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
      onClick={() => onSelect(node.path)}
    >
      <File className="h-4 w-4 text-muted-foreground" />
      <span>{node.name}</span>
    </button>
  );
}
