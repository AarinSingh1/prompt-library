import { handlers } from '@/auth'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, ctx: { params: Promise<{ nextauth: string[] }> }) {
  console.log('[route][GET] url:', req.url)
  try {
    return await handlers.GET(req, ctx)
  } catch (e: unknown) {
    const err = e as Error
    console.error('[route][GET][unhandled]', err?.name, err?.message, '\nstack:', err?.stack, '\ncause:', (err as { cause?: unknown })?.cause)
    return Response.json({ error: 'Internal Server Error', message: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ nextauth: string[] }> }) {
  console.log('[route][POST] url:', req.url)
  try {
    return await handlers.POST(req, ctx)
  } catch (e: unknown) {
    const err = e as Error
    console.error('[route][POST][unhandled]', err?.name, err?.message, '\nstack:', err?.stack, '\ncause:', (err as { cause?: unknown })?.cause)
    return Response.json({ error: 'Internal Server Error', message: err?.message }, { status: 500 })
  }
}
