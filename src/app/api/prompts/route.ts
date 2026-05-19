import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { promptSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const folderId = searchParams.get('folderId')
  const tagId = searchParams.get('tagId')

  const prompts = await db.prompt.findMany({
    where: {
      userId: session.user.id,
      ...(folderId ? { folderId } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
      ...(tagId ? { tags: { some: { tagId } } } : {}),
    },
    include: {
      tags: { include: { tag: true } },
      folder: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(prompts)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = promptSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { title, content, description, folderId, tagIds } = parsed.data

  const prompt = await db.prompt.create({
    data: {
      title,
      content,
      description,
      userId: session.user.id,
      folderId: folderId ?? null,
      tags: tagIds?.length
        ? { create: tagIds.map((tagId) => ({ tagId })) }
        : undefined,
      versions: {
        create: { content, source: 'manual' },
      },
    },
    include: { tags: { include: { tag: true } }, folder: true },
  })

  return NextResponse.json(prompt, { status: 201 })
}
