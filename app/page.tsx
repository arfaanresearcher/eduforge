import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Hammer,
  Sparkles,
  GraduationCap,
  Zap,
  Shield,
  BarChart3,
  Users,
  ArrowRight,
  Star,
  Check,
  Brain,
  Code,
  Award,
} from "lucide-react";

const courses = [
  {
    slug: "ai-machine-learning-diploma",
    title: "AI & Machine Learning",
    description:
      "Master neural networks, deep learning, and modern AI frameworks from scratch to production.",
    type: "DIPLOMA",
    price: "$299",
    duration: "12 weeks",
  },
  {
    slug: "python-data-science",
    title: "Python for Data Science",
    description:
      "Learn Python, pandas, NumPy, and visualization tools to analyze and present data effectively.",
    type: "SHORT_COURSE",
    price: "$79",
    duration: "4 weeks",
  },
  {
    slug: "full-stack-development-diploma",
    title: "Full-Stack Development",
    description:
      "Build production-ready web applications with React, Next.js, Node, and cloud deployment.",
    type: "DIPLOMA",
    price: "$349",
    duration: "16 weeks",
  },
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Tutoring",
    description:
      "Get real-time, personalized guidance from an AI tutor that adapts to your learning style and pace.",
  },
  {
    icon: BookOpen,
    title: "Structured Courses",
    description:
      "Follow expert-designed curricula with clear milestones, from beginner fundamentals to advanced topics.",
  },
  {
    icon: Code,
    title: "Prototype Playground",
    description:
      "Build and test code in sandboxed environments with AI pair-programming assistance built right in.",
  },
  {
    icon: Award,
    title: "Industry Certificates",
    description:
      "Earn verifiable digital credentials recognized by employers and shareable on your professional profile.",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description:
      "Track your learning velocity, strengths, and areas for improvement with detailed visual dashboards.",
  },
  {
    icon: Users,
    title: "Community Learning",
    description:
      "Collaborate with peers, join study groups, and participate in code reviews and group challenges.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Get started with the basics",
    features: [
      "2 free courses",
      "Basic AI chat assistance",
      "Community forum access",
      "Progress tracking",
    ],
    highlighted: false,
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    description: "Everything you need to level up",
    features: [
      "All courses included",
      "Unlimited AI tutoring",
      "Industry certificates",
      "Prototype playground",
      "Priority support",
    ],
    highlighted: true,
    cta: "Go Pro",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams and organizations",
    features: [
      "Team management dashboard",
      "Custom course creation",
      "API access & integrations",
      "Dedicated account manager",
      "SSO & compliance",
    ],
    highlighted: false,
    cta: "Contact Sales",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "ML Engineer at Stripe",
    initials: "SC",
    quote:
      "EduForge transformed my career. The AI tutor felt like having a senior engineer available around the clock. I went from Python basics to deploying ML models in production.",
    stars: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Full-Stack Developer",
    initials: "MR",
    quote:
      "The prototype playground is a game-changer. I built my entire portfolio project within the platform and landed interviews at three top-tier companies.",
    stars: 5,
  },
  {
    name: "Aisha Patel",
    role: "Data Analyst at Shopify",
    initials: "AP",
    quote:
      "The structured curriculum combined with AI-powered feedback loops meant I could learn at my own pace without ever feeling lost. Worth every penny.",
    stars: 5,
  },
];

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description:
      "Create your free account in seconds. No credit card required to start exploring.",
    icon: Zap,
  },
  {
    number: "02",
    title: "Learn",
    description:
      "Follow structured courses with real-time AI tutoring that adapts to your pace.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "Build",
    description:
      "Create real prototypes in our sandboxed playground and build your portfolio.",
    icon: Hammer,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[oklch(0.08_0.02_260)]">
      {/* ===== NAVBAR ===== */}
      <header className="sticky top-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7" style={{ color: '#2A8899' }} />
            <span className="text-xl font-bold gradient-text">EduForge</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#courses"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Courses
            </a>
            <a
              href="#pricing"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/5"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="text-white border-0 glow-sm" style={{ background: 'linear-gradient(135deg, #C9956F, #A87B55)' }}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ===== HERO ===== */}
        <section className="relative overflow-hidden">
          {/* Background gradient orbs */}
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(42, 136, 153, 0.2), rgba(201, 149, 111, 0.15), rgba(24, 92, 107, 0.1))' }} />
          <div className="absolute bottom-[-100px] right-[-200px] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(201, 149, 111, 0.1)' }} />

          <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 text-center space-y-8">
            <Badge
              variant="outline"
              className="glass px-4 py-1.5 text-sm"
              style={{ borderColor: 'rgba(42, 136, 153, 0.3)', color: '#3BA5B5' }}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" style={{ color: '#C9956F' }} />
              Powered by AI
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-white">The Future of</span>
              <br />
              <span className="gradient-text">Learning is Here</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              Master cutting-edge skills with AI-powered tutoring, structured
              courses, and hands-on prototyping. Your personalized learning
              journey starts now.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/learn">
                <Button
                  size="lg"
                  className="text-white border-0 glow-md text-base px-8 py-6 animate-gradient"
                  style={{ background: 'linear-gradient(135deg, #C9956F, #A87B55)' }}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Explore Courses
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/playground">
                <Button
                  size="lg"
                  variant="outline"
                  className="glass text-white hover:bg-white/5 text-base px-8 py-6"
                  style={{ borderColor: 'rgba(42, 136, 153, 0.3)' }}
                >
                  <Hammer className="h-5 w-5 mr-2" />
                  Start Building
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto pt-12">
              {[
                { value: "10,000+", label: "Students" },
                { value: "50+", label: "Courses" },
                { value: "95%", label: "Completion" },
                { value: "24/7", label: "AI Tutor" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section id="features" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <Badge
                variant="outline"
                className="glass px-4 py-1.5 text-sm"
                style={{ borderColor: 'rgba(201, 149, 111, 0.3)', color: '#C9956F' }}
              >
                Features
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Everything You Need to{" "}
                <span className="gradient-text">Succeed</span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">
                A comprehensive platform built for the modern learner, combining
                AI intelligence with proven educational frameworks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="glass neon-border rounded-2xl bg-transparent"
                >
                  <CardContent className="p-8 space-y-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #185C6B, #2A8899)' }}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== POPULAR COURSES ===== */}
        <section id="courses" className="py-24 relative">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, rgba(201, 149, 111, 0.05), transparent)' }} />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <Badge
                variant="outline"
                className="glass px-4 py-1.5 text-sm"
                style={{ borderColor: 'rgba(42, 136, 153, 0.3)', color: '#3BA5B5' }}
              >
                Popular Courses
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Start Your <span className="gradient-text">Journey</span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">
                Industry-aligned courses designed by experts, enhanced with AI
                tutoring at every step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.slug}
                  className="glass neon-border rounded-2xl bg-transparent group"
                >
                  <CardContent className="p-8 space-y-5">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="border-0"
                        style={
                          course.type === "DIPLOMA"
                            ? { borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(42, 136, 153, 0.4)', color: '#3BA5B5', backgroundColor: 'rgba(42, 136, 153, 0.1)' }
                            : { borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(201, 149, 111, 0.4)', color: '#C9956F', backgroundColor: 'rgba(201, 149, 111, 0.1)' }
                        }
                      >
                        {course.type === "DIPLOMA"
                          ? "Diploma"
                          : "Short Course"}
                      </Badge>
                      <span className="text-xs text-white/30">
                        {course.duration}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {course.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-bold gradient-text">
                        {course.price}
                      </span>
                      <Link href={`/learn/${course.slug}`}>
                        <Button
                          variant="ghost"
                          className="hover:bg-transparent group-hover:translate-x-1 transition-transform"
                          style={{ color: '#3BA5B5' }}
                        >
                          View Course
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <Badge
                variant="outline"
                className="glass px-4 py-1.5 text-sm"
                style={{ borderColor: 'rgba(201, 149, 111, 0.3)', color: '#C9956F' }}
              >
                How It Works
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Three Steps to{" "}
                <span className="gradient-text">Mastery</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line (visible on md+) */}
              <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px]" style={{ background: 'linear-gradient(to right, rgba(42, 136, 153, 0.4), rgba(201, 149, 111, 0.4), rgba(24, 92, 107, 0.4))' }} />

              {steps.map((step) => (
                <div key={step.number} className="text-center space-y-4">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl glow-sm mx-auto" style={{ background: 'linear-gradient(135deg, rgba(42, 136, 153, 0.2), rgba(201, 149, 111, 0.2))' }}>
                    <step.icon className="h-7 w-7" style={{ color: '#3BA5B5' }} />
                    <span className="absolute -top-2 -right-2 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center" style={{ color: '#C9956F', backgroundColor: 'rgba(201, 149, 111, 0.2)', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(201, 149, 111, 0.3)' }}>
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/40 max-w-xs mx-auto leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section id="pricing" className="py-24 relative">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, rgba(42, 136, 153, 0.05), transparent)' }} />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <Badge
                variant="outline"
                className="glass px-4 py-1.5 text-sm"
                style={{ borderColor: 'rgba(42, 136, 153, 0.3)', color: '#3BA5B5' }}
              >
                Pricing
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Simple, <span className="gradient-text">Transparent</span>{" "}
                Pricing
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">
                Start free and scale as you grow. No hidden fees, cancel
                anytime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`rounded-2xl bg-transparent relative ${
                    plan.highlighted
                      ? "glass-strong neon-border glow-md"
                      : "glass neon-border"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="text-white border-0 px-4 py-1" style={{ background: 'linear-gradient(135deg, #C9956F, #A87B55)' }}>
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-8 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-white/40 mt-1">
                        {plan.description}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold gradient-text">
                        {plan.price}
                      </span>
                      <span className="text-white/40 text-sm">
                        {plan.period}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3 text-sm text-white/60"
                        >
                          <Check className="h-4 w-4 shrink-0" style={{ color: '#3BA5B5' }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/sign-up" className="block">
                      <Button
                        className={`w-full ${
                          plan.highlighted
                            ? "text-white border-0"
                            : "glass border-white/10 text-white hover:bg-white/5"
                        }`}
                        style={plan.highlighted ? { background: 'linear-gradient(135deg, #C9956F, #A87B55)' } : undefined}
                      >
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <Badge
                variant="outline"
                className="glass px-4 py-1.5 text-sm"
                style={{ borderColor: 'rgba(201, 149, 111, 0.3)', color: '#C9956F' }}
              >
                Testimonials
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Loved by <span className="gradient-text">Learners</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <Card
                  key={t.name}
                  className="glass neon-border rounded-2xl bg-transparent"
                >
                  <CardContent className="p-8 space-y-5">
                    <div className="flex gap-1">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white/80 border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(42, 136, 153, 0.3), rgba(201, 149, 111, 0.3))' }}>
                        {t.initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {t.name}
                        </div>
                        <div className="text-xs text-white/40">{t.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="relative rounded-3xl overflow-hidden p-12 sm:p-16 text-center space-y-6">
              {/* CTA gradient background */}
              <div className="absolute inset-0 animate-gradient" style={{ background: 'linear-gradient(135deg, rgba(42, 136, 153, 0.2), rgba(24, 92, 107, 0.2), rgba(13, 59, 69, 0.2))' }} />
              <div className="absolute inset-0 glass-strong" />

              <div className="relative space-y-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  Start Your Learning Journey{" "}
                  <span className="gradient-text">Today</span>
                </h2>
                <p className="text-white/50 max-w-lg mx-auto">
                  Join thousands of learners already building the future.
                  Start free, upgrade when you are ready.
                </p>
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="text-white border-0 glow-md text-base px-10 py-6 mt-4"
                    style={{ background: 'linear-gradient(135deg, #C9956F, #A87B55)' }}
                  >
                    Get Started for Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="glass-strong border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Product</h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="#features"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#courses"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    Courses
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <Link
                    href="/playground"
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    Playground
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Company</h4>
              <ul className="space-y-2.5">
                <li>
                  <span className="text-sm text-white/40">About</span>
                </li>
                <li>
                  <span className="text-sm text-white/40">Blog</span>
                </li>
                <li>
                  <span className="text-sm text-white/40">Careers</span>
                </li>
                <li>
                  <span className="text-sm text-white/40">Contact</span>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Resources</h4>
              <ul className="space-y-2.5">
                <li>
                  <span className="text-sm text-white/40">Documentation</span>
                </li>
                <li>
                  <span className="text-sm text-white/40">Help Center</span>
                </li>
                <li>
                  <span className="text-sm text-white/40">Community</span>
                </li>
                <li>
                  <span className="text-sm text-white/40">API Reference</span>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-white">Legal</h4>
              <ul className="space-y-2.5">
                <li>
                  <span className="text-sm text-white/40">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-sm text-white/40">
                    Terms of Service
                  </span>
                </li>
                <li>
                  <span className="text-sm text-white/40">Cookie Policy</span>
                </li>
                <li>
                  <span className="text-sm text-white/40">Licenses</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" style={{ color: '#2A8899' }} />
              <span className="text-sm font-semibold gradient-text">
                EduForge
              </span>
            </div>
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} EduForge. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-white/30">
              <span>Twitter</span>
              <span>GitHub</span>
              <span>Discord</span>
              <span>LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
