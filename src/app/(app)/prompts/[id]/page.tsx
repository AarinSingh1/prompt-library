import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DeletePromptButton } from '@/components/delete-prompt-button'
import { CopyButton } from '@/components/copy-button'
import { PromptOptimizer } from '@/components/prompt-optimizer'
import { cn } from '@/lib/utils'
import { FolderOpen, Pencil, Clock } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PromptDetailPage({ params }: PageProps) {
  const session = await auth()
  const { id } = await params

  const prompt = await db.prompt.findFirst({
    where: { id, userId: session!.user.id },
    include: {
      tags: { include: { tag: true } },
      folder: true,
      versions: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })

  if (!prompt) notFound()

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight break-words">{prompt.title}</h1>
          {prompt.description && (
            <p className="mt-1 text-sm text-muted-foreground">{prompt.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CopyButton text={prompt.content} />
          <Link
            href={`/prompts/${prompt.id}/edit`}
            className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
          >
            <Pencil className="h-4 w-4 mr-1.5" />
            Edit
          </Link>
          <DeletePromptButton promptId={prompt.id} />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/40 p-4 font-mono text-sm whitespace-pre-wrap leading-relaxed">
        {prompt.content}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {prompt.folder && (
          <span className="flex items-center gap-1.5">
            <FolderOpen className="h-4 w-4" />
            {prompt.folder.name}
          </span>
        )}
        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {prompt.tags.map(({ tag }) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
        <span className="ml-auto flex items-center gap-1.5 text-xs">
          <Clock className="h-3.5 w-3.5" />
          Updated {new Date(prompt.updatedAt).toLocaleDateString()}
        </span>
      </div>

      {/* AI Optimizer */}
      <PromptOptimizer promptId={prompt.id} originalContent={prompt.content} />

      {/* Version History */}
      {prompt.versions.length > 1 && (
        <>
          <Separator className="my-6" />
          <div>
            <h2 className="text-sm font-semibold mb-3">Version history</h2>
            <div className="space-y-2">
              {prompt.versions.map((v, i) => (
                <div key={v.id} className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="w-4 text-right text-foreground font-medium">{prompt.versions.length - i}</span>
                  <span className={cn('capitalize font-medium', v.source === 'optimization' ? 'text-violet-500' : 'text-foreground')}>
                    {v.source === 'optimization' ? '✨ AI' : 'Manual'}
                  </span>
                  <span>{new Date(v.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
