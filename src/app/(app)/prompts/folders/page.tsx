import { auth } from '@/auth'
import { db } from '@/lib/db'
import { FolderManager } from '@/components/folder-manager'

export default async function FoldersPage() {
  const session = await auth()
  const folders = await db.folder.findMany({
    where: { userId: session!.user.id },
    include: { _count: { select: { prompts: true } } },
    orderBy: { name: 'asc' },
  })

  return <FolderManager folders={folders} />
}
