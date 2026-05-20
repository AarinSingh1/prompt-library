import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const folderSchema = z.object({
  name: z.string().min(1).max(50),
  parentFolderId: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const folders = await db.folder.findMany({
    where: { userId: session.user.id },
    include: { children: true, _count: { select: { prompts: true } } },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(folders)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = folderSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const folder = await db.folder.create({
    data: { ...parsed.data, userId: session.user.id },
  })

  return NextResponse.json(folder, { status: 201 })
}
