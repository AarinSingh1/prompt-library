import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const saveSchema = z.object({
  optimizedContent: z.string().min(1),
  mode: z.enum(['replace', 'new-version']),
  rating: z.number().min(-1).max(1).optional(),
})

// Save the optimized result
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const prompt = await db.prompt.findFirst({ where: { id, userId: session.user.id } })
  if (!prompt) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = saveSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { optimizedContent, mode } = parsed.data

  if (mode === 'replace') {
    // Snapshot current then overwrite
    await db.promptVersion.create({
      data: { promptId: id, content: prompt.content, source: 'manual' },
    })
    const updated = await db.prompt.update({
      where: { id },
      data: {
        content: optimizedContent,
        versions: { create: { content: optimizedContent, source: 'optimization' } },
      },
    })
    return NextResponse.json(updated)
  } else {
    // new-version — just save version, don't change current content
    await db.promptVersion.create({
      data: { promptId: id, content: optimizedContent, source: 'optimization' },
    })
    return NextResponse.json(prompt)
  }
}
