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
  DIPLOMA: "bg-purple-100 text-purple-800",
  SHORT_COURSE: "bg-blue-100 text-blue-800",
  CERTIFICATION: "bg-green-100 text-green-800",
};

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-800",
  INTERMEDIATE: "bg-amber-100 text-amber-800",
  ADVANCED: "bg-red-100 text-red-800",
};

const TYPE_GRADIENTS: Record<string, string> = {
  DIPLOMA: "from-purple-500/20 to-violet-500/20",
  SHORT_COURSE: "from-cyan-500/20 to-blue-500/20",
  CERTIFICATION: "from-emerald-500/20 to-green-500/20",
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
  const gradient = TYPE_GRADIENTS[type] ?? "from-slate-500/20 to-slate-400/20";

  return (
    <Link href={`/learn/${slug}`}>
      <Card className="h-full glass neon-border hover:shadow-md transition-shadow group cursor-pointer">
        <div
          className={`h-40 bg-gradient-to-br ${gradient} rounded-t-lg flex items-center justify-center`}
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
