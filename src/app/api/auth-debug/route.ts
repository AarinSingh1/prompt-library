import { NextRequest } from 'next/server'
import { db } from '@/lib/db'

/**
 * Temporary diagnostic endpoint. Checks every env var and DB connection
 * that the Google OAuth callback relies on. DELETE after debugging.
 *
 * Accessible at /api/auth-debug (no auth required — remove after use).
 */
export async function GET(_req: NextRequest) {
  const results: Record<string, unknown> = {}

  // 1. Check env vars (values masked, just whether they are set and non-empty)
  const check = (name: string) => {
    const v = process.env[name]
    if (!v) return 'MISSING'
    if (v.length < 4) return 'SET_BUT_VERY_SHORT'
    return `SET (${v.length} chars, starts: ${v.slice(0, 4)}...)`
  }

  results.env = {
    NEXTAUTH_SECRET: check('NEXTAUTH_SECRET'),
    AUTH_SECRET: check('AUTH_SECRET'),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? '(not set)',
    AUTH_URL: process.env.AUTH_URL ?? '(not set)',
    GOOGLE_CLIENT_ID: check('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: check('GOOGLE_CLIENT_SECRET'),
    PRISMA_DATABASE_URL: check('PRISMA_DATABASE_URL'),
    DATABASE_URL: check('DATABASE_URL'),
    NODE_ENV: process.env.NODE_ENV,
  }

  // 2. Test DB connection with a simple query
  try {
    const count = await db.user.count()
    results.db = { status: 'OK', userCount: count }
  } catch (e: unknown) {
    const err = e as Error
    results.db = {
      status: 'ERROR',
      name: err?.name,
      message: err?.message,
      cause: String((err as { cause?: unknown })?.cause ?? ''),
    }
  }

  console.log('[auth-debug]', JSON.stringify(results))

  return Response.json(results)
}
