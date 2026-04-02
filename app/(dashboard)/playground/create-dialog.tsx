"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

const TECH_OPTIONS = [
  "Node.js",
  "Python",
  "Go",
  "React",
  "Vue",
  "Next.js",
  "Express",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
];

export function CreatePrototypeDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleTech = (tech: string) => {
    setTechStack((prev) =>
      prev.includes(tech)
        ? prev.filter((t) => t !== tech)
        : [...prev, tech],
    );
  };

  const handleCreate = async () => {
    if (!title.trim() || techStack.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/sandbox/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          techStack,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOpen(false);
        router.push(`/playground/${data.sandboxId}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4 mr-2" />
        New Prototype
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Prototype</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My awesome project"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you building?"
              rows={3}
            />
          </div>
          <div>
            <Label>Tech Stack</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TECH_OPTIONS.map((tech) => (
                <Badge
                  key={tech}
                  variant={techStack.includes(tech) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTech(tech)}
                >
                  {tech}
                  {techStack.includes(tech) && <X className="h-3 w-3 ml-1" />}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            onClick={handleCreate}
            disabled={!title.trim() || techStack.length === 0 || loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Prototype"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
