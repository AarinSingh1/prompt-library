import { auth } from '@/auth'
import { db } from '@/lib/db'
import { TagManager } from '@/components/tag-manager'

export default async function TagsPage() {
  const session = await auth()
  const tags = await db.tag.findMany({
    where: { userId: session!.user.id },
    include: { _count: { select: { prompts: true } } },
    orderBy: { name: 'asc' },
  })

  return <TagManager tags={tags} />
}
