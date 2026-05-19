import { auth } from '@/auth'
import { db } from '@/lib/db'
import { PromptForm } from '@/components/prompt-form'

export default async function NewPromptPage() {
  const session = await auth()
  const [folders, tags] = await Promise.all([
    db.folder.findMany({ where: { userId: session!.user.id }, orderBy: { name: 'asc' } }),
    db.tag.findMany({ where: { userId: session!.user.id }, orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Prompt</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Add a new prompt to your library.</p>
      </div>
      <PromptForm folders={folders} tags={tags} />
    </div>
  )
}
