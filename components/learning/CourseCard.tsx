"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users } from "lucide-react";

interface CourseCardProps {
  slug: string;
  title: string;
  description: string;
  type: string;
  level: string;
  price: number;
  duration: number;
  thumbnailUrl?: string | null;
  instructorName?: string | null;
  enrollmentCount: number;
  userProgress?: number | null;
}

const TYPE_COLORS: Record<string, string> = {
  DIPLOMA: "bg-[#185C6B]/10 text-[#185C6B]",
  SHORT_COURSE: "bg-[#C9956F]/10 text-[#A87B55]",
  CERTIFICATION: "bg-[#2A8899]/10 text-[#2A8899]",
};

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-800",
  INTERMEDIATE: "bg-amber-100 text-amber-800",
  ADVANCED: "bg-red-100 text-red-800",
};

const TYPE_GRADIENTS: Record<string, string> = {
  DIPLOMA: "",
  SHORT_COURSE: "",
  CERTIFICATION: "",
};

const TYPE_INLINE_GRADIENTS: Record<string, string> = {
  DIPLOMA: "linear-gradient(to bottom right, rgba(24,92,107,0.2), rgba(13,59,69,0.2))",
  SHORT_COURSE: "linear-gradient(to bottom right, rgba(201,149,111,0.2), rgba(168,123,85,0.2))",
  CERTIFICATION: "linear-gradient(to bottom right, rgba(42,136,153,0.2), rgba(24,92,107,0.2))",
};

export function CourseCard({
  slug,
  title,
  description,
  type,
  level,
  price,
  duration,
  instructorName,
  enrollmentCount,
  userProgress,
}: CourseCardProps) {
  const isEnrolled = userProgress !== null && userProgress !== undefined;
  const inlineGradient = TYPE_INLINE_GRADIENTS[type] ?? "linear-gradient(to bottom right, rgba(24,92,107,0.2), rgba(201,149,111,0.2))";

  return (
    <Link href={`/learn/${slug}`}>
      <Card className="h-full glass neon-border hover:shadow-md transition-shadow group cursor-pointer">
        <div
          className="h-40 rounded-t-lg flex items-center justify-center"
          style={{ background: inlineGradient }}
        >
          <span className="text-4xl font-bold text-white/40 group-hover:text-white/60 transition-colors">
            {title.charAt(0)}
          </span>
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex gap-2">
            <Badge variant="secondary" className={TYPE_COLORS[type] ?? ""}>
              {type.replace("_", " ")}
            </Badge>
            <Badge variant="secondary" className={LEVEL_COLORS[level] ?? ""}>
              {level}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          {instructorName && (
            <p className="text-xs text-muted-foreground">
              by {instructorName}
            </p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {duration}h
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {enrollmentCount}
            </span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {isEnrolled ? (
            <div className="w-full space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(userProgress)}%</span>
              </div>
              <Progress value={userProgress} className="h-2" />
            </div>
          ) : (
            <span className="text-lg font-bold gradient-text">${price}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
