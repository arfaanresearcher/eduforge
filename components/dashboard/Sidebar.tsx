"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BookOpen, Hammer, LayoutDashboard, User, Rocket, Sparkles, NotebookPen } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/learn", icon: BookOpen, label: "Learning Hub" },
  { href: "/learn/ai-machine-learning-fundamentals/notebook", icon: NotebookPen, label: "AI Notebooks" },
  { href: "/playground", icon: Hammer, label: "Playground" },
  { href: "/admin", icon: LayoutDashboard, label: "Admin Panel" },
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/onboarding", icon: Rocket, label: "Get Started" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 glass-strong flex flex-col h-full">
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #185C6B, #C9956F)' }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">EduForge</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200",
                isActive
                  ? "glass text-primary glow-sm font-medium border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #185C6B, #C9956F)' }}>
            AR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Alex Rivera</p>
            <p className="text-xs text-muted-foreground">Student</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
