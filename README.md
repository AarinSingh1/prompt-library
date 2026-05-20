# Prompt Library

Save, organize, and optimize your AI prompts with Claude.

## Features

- 📝 **Save prompts** — create, edit, delete, and copy prompts
- 📁 **Organize** — folders and color-coded tags with filterable sidebar
- 🔍 **Search** — full-text search across title, content, and description
- ✨ **AI optimization** — streaming Claude optimizer with side-by-side before/after view
- 🕒 **Version history** — every edit and optimization is snapshotted
- 🌙 **Dark mode** — system default with manual toggle
- 📱 **Mobile-friendly** — slide-out drawer sidebar on small screens

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma 7
- **Auth**: NextAuth v5 (Google OAuth)
- **UI**: Shadcn/UI + Tailwind CSS v4
- **AI**: Anthropic Claude API (streaming)

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/AarinSingh1/prompt-library.git
cd prompt-library
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Your local PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console |
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com) |

### 3. Set up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### 4. Run database migrations

```bash
npm run db:migrate
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

### 1. Create a Vercel project

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import `AarinSingh1/prompt-library`
3. Framework preset: **Next.js** (auto-detected)

### 2. Add environment variables in Vercel dashboard

Set all variables from `.env.example` in **Settings → Environment Variables**.

For `NEXTAUTH_URL` use your production domain: `https://your-app.vercel.app`

For `DATABASE_URL` use a hosted PostgreSQL service:
- [Neon](https://neon.tech) — free tier, serverless Postgres, recommended
- [Supabase](https://supabase.com) — free tier
- [Railway](https://railway.app)

### 3. Deploy

Vercel auto-deploys on every push to `main`. The `vercel.json` build command runs `prisma generate && next build` so the Prisma client is always up to date.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Prettier
npm run db:migrate   # Apply database migrations
npm run db:studio    # Open Prisma Studio (visual DB browser)
npm run db:generate  # Regenerate Prisma client
```
