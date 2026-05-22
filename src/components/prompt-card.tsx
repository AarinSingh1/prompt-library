'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, FolderOpen } from 'lucide-react'

interface Tag { id: string; name: string; color: string }
interface Folder { id: string; name: string }

interface PromptCardProps {
  id: string
  title: string
  description?: string | null
  content: string
  folder?: Folder | null
  tags: { tag: Tag }[]
  updatedAt: string
}

export function PromptCard({ id, title, description, content, folder, tags, updatedAt }: PromptCardProps) {
  function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard')
  }

  return (
    <Link href={`/prompts/${id}`} className="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/30">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-sm leading-snug line-clamp-1">{title}</h3>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
          title="Copy prompt"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>

      {description && (
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{description}</p>
      )}

      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 font-mono">{content}</p>

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {folder && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <FolderOpen className="h-3 w-3" />
            {folder.name}
          </span>
        )}
        {tags.map(({ tag }) => (
          <Badge key={tag.id} variant="secondary" className="text-xs px-1.5 py-0" style={{ borderColor: tag.color }}>
            {tag.name}
          </Badge>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {new Date(updatedAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  )
}
