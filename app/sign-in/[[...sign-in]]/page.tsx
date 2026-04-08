"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, GitBranch, Mail } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    toast("Welcome back!");
    setTimeout(() => {
      router.push("/learn");
    }, 1000);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(to bottom right, #185C6B, #C9956F)' }}>
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">EduForge</span>
          </div>

          {/* Glass card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Sign in to continue your learning journey
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-white/10 bg-white/5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-white/10 bg-white/5"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/5"
                style={{ accentColor: '#C9956F' }}
                />
                <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-[0_0_24px_rgba(201,149,111,0.4)] disabled:opacity-60"
                style={{ background: 'linear-gradient(to right, #C9956F, #A87B55)' }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-muted-foreground">Or continue with</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Social buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => toast("Google sign-in coming soon!")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
              >
                <Mail className="h-4 w-4" />
                Google
              </button>
              <button
                type="button"
                onClick={() => toast("GitHub sign-in coming soon!")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
              >
                <GitBranch className="h-4 w-4" />
                GitHub
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="font-medium hover:underline" style={{ color: '#C9956F' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Decorative panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgba(24,92,107,0.2), rgba(201,149,111,0.2), rgba(42,136,153,0.2))' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(24,92,107,0.15), transparent 70%)' }} />
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(24,92,107,0.1)' }} />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(201,149,111,0.1)' }} />
        <div className="relative z-10 max-w-md px-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-2xl" style={{ background: 'linear-gradient(to bottom right, #185C6B, #C9956F)' }}>
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="mb-3 text-3xl font-bold">Learn. Build. Grow.</h2>
          <p className="text-muted-foreground">
            Access world-class courses, build real-world projects, and earn industry-recognized certifications.
          </p>
        </div>
      </div>
    </div>
  );
}
