# EduForge

AI-powered digital learning and prototyping platform. EduForge combines structured course delivery (diplomas, short courses, certifications) with an interactive prototyping playground, powered by Claude AI for personalized recommendations and real-time tutoring.

## Prerequisites

- **Node.js** 20+ and npm
- **Docker** (for sandbox code execution)
- **PostgreSQL** database (Neon recommended)

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd eduforge
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

### 3. Get API keys

| Service | Where to get it | Variable(s) |
|---------|----------------|-------------|
| **Neon PostgreSQL** | [neon.tech](https://neon.tech) - New Project - Connection string | `DATABASE_URL`, `DIRECT_URL` |
| **Clerk Auth** | [dashboard.clerk.com](https://dashboard.clerk.com) - Create App - API Keys | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET` |
| **Anthropic Claude** | [console.anthropic.com](https://console.anthropic.com) - API Keys | `ANTHROPIC_API_KEY` |
| **Pinecone** | [app.pinecone.io](https://app.pinecone.io) - Create Index (dim: 1536, cosine) | `PINECONE_API_KEY`, `PINECONE_INDEX`, `PINECONE_HOST` |
| **AWS S3** | AWS Console - IAM - Create User with S3FullAccess | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET` |
| **Stripe** | [dashboard.stripe.com](https://dashboard.stripe.com) - Developers - API Keys | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Upstash Redis** | [console.upstash.com](https://console.upstash.com) - Create Database - REST API | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |

### 4. Set up the database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

Or use the setup script:

```bash
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Docker sandbox (optional)

Ensure Docker Desktop is running. The sandbox service starts containers on-demand when users execute code in the playground.

```bash
docker info
```

## Project Structure

```
eduforge/
├── app/
│   ├── (dashboard)/        # Authenticated routes
│   ├── api/                # Route handlers
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── learning/           # Course, lesson, quiz components
│   ├── playground/         # Code editor, terminal, file tree
│   └── ui/                 # shadcn/ui components
├── lib/                    # Core utilities (ai, auth, db, sandbox, etc.)
├── prisma/                 # Schema and seed data
└── scripts/                # Setup scripts
```

## Tech Stack

- **Framework:** Next.js (App Router)
- **Auth:** Clerk
- **Database:** PostgreSQL via Prisma
- **AI:** Anthropic Claude
- **Vector Search:** Pinecone
- **Storage:** AWS S3
- **Payments:** Stripe
- **Rate Limiting:** Upstash Redis
- **Sandboxing:** Docker
- **UI:** Tailwind CSS, shadcn/ui, Radix
- **Code Editor:** Monaco Editor
