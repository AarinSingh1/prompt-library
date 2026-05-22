import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { promptSchema } from '@/lib/validations'

async function getPromptForUser(id: string, userId: string) {
  return db.prompt.findFirst({ where: { id, userId } })
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const prompt = await db.prompt.findFirst({
    where: { id, userId: session.user.id },
    include: {
      tags: { include: { tag: true } },
      folder: true,
      versions: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!prompt) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(prompt)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await getPromptForUser(id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = promptSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { title, content, description, folderId, tagIds } = parsed.data

  const prompt = await db.prompt.update({
    where: { id },
    data: {
      title,
      content,
      description,
      folderId: folderId ?? null,
      tags: {
        deleteMany: {},
        ...(tagIds?.length ? { create: tagIds.map((tagId) => ({ tagId })) } : {}),
      },
      versions: {
        create: { content, source: 'manual' },
      },
    },
    include: { tags: { include: { tag: true } }, folder: true },
  })

  return NextResponse.json(prompt)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await getPromptForUser(id, session.user.id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await db.prompt.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
