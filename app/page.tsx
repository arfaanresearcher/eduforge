import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Hammer, Sparkles, GraduationCap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold">EduForge</span>
          <div className="flex gap-3">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-6 py-24 text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Learn. Build. Ship.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered learning platform with hands-on prototyping.
            Master new skills through structured courses and build real projects
            with intelligent coding assistance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/learn">
              <Button size="lg">
                <BookOpen className="h-4 w-4 mr-2" />
                Explore Courses
              </Button>
            </Link>
            <Link href="/playground">
              <Button size="lg" variant="outline">
                <Hammer className="h-4 w-4 mr-2" />
                Start Building
              </Button>
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<GraduationCap className="h-8 w-8" />}
              title="Structured Learning"
              description="Diplomas, short courses, and certifications with real-world curriculum designed by industry experts."
            />
            <FeatureCard
              icon={<Sparkles className="h-8 w-8" />}
              title="AI-Powered Tutoring"
              description="Get personalized guidance from Claude AI as you learn. Ask questions, get explanations, and receive recommendations."
            />
            <FeatureCard
              icon={<Hammer className="h-8 w-8" />}
              title="Prototype Playground"
              description="Build and test code in sandboxed environments with AI assistance. Ship prototypes faster than ever."
            />
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        EduForge - AI-Powered Digital Learning & Prototyping
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center space-y-3 p-6">
      <div className="inline-flex items-center justify-center rounded-lg bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
