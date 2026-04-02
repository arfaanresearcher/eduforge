import Link from "next/link";
import { BookOpen, Hammer, LayoutDashboard, User } from "lucide-react";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = clerkKey && !clerkKey.includes("placeholder");

async function UserSection() {
  if (!isClerkConfigured) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>Guest</span>
      </div>
    );
  }
  const { UserButton } = await import("@clerk/nextjs");
  return <UserButton />;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-muted/30 flex flex-col">
        <div className="p-6 border-b">
          <Link href="/learn" className="text-xl font-bold">
            EduForge
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink href="/learn" icon={<BookOpen className="h-4 w-4" />}>
            Learning Hub
          </NavLink>
          <NavLink href="/playground" icon={<Hammer className="h-4 w-4" />}>
            Playground
          </NavLink>
          <NavLink href="/admin" icon={<LayoutDashboard className="h-4 w-4" />}>
            Admin
          </NavLink>
        </nav>
        <div className="p-4 border-t">
          <UserSection />
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}
