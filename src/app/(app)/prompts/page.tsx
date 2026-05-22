import Link from 'next/link'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { PromptCard } from '@/components/prompt-card'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Plus, Search } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{ search?: string; folderId?: string; tagId?: string }>
}

export default async function PromptsPage({ searchParams }: PageProps) {
  const session = await auth()
  const { search = '', folderId, tagId } = await searchParams

  const prompts = await db.prompt.findMany({
    where: {
      userId: session!.user.id,
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
    include: { tags: { include: { tag: true } }, folder: true },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Prompts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'}
          </p>
        </div>
        <Link href="/prompts/new" className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="h-4 w-4 mr-1.5" />
          New prompt
        </Link>
      </div>

      <form className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input name="search" defaultValue={search} placeholder="Search prompts…" className="pl-9" />
      </form>

      {prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
          <p className="text-sm font-medium">
            {search ? `No prompts matching "${search}"` : 'No prompts yet'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {search ? 'Try a different search term.' : 'Create your first prompt to get started.'}
          </p>
          {!search && (
            <Link href="/prompts/new" className={cn(buttonVariants({ size: 'sm' }), 'mt-4')}>
              <Plus className="h-4 w-4 mr-1.5" />
              New prompt
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              id={prompt.id}
              title={prompt.title}
              description={prompt.description}
              content={prompt.content}
              folder={prompt.folder}
              tags={prompt.tags as { tag: { id: string; name: string; color: string } }[]}
              updatedAt={prompt.updatedAt.toISOString()}
            />
          ))}
        </div>
      )}
    </div>
  )
}
