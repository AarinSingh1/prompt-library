'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { FolderOpen, Home, Tag } from 'lucide-react'

interface Folder { id: string; name: string }
interface TagType { id: string; name: string; color: string }

interface SidebarProps {
  folders: Folder[]
  tags: TagType[]
}

export function Sidebar({ folders, tags }: SidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const activeFolderId = searchParams.get('folderId')
  const activeTagId = searchParams.get('tagId')

  function filterLink(key: string, value: string) {
    const params = new URLSearchParams()
    params.set(key, value)
    return `/prompts?${params.toString()}`
  }

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-background overflow-y-auto">
      <nav className="flex flex-col gap-0.5 p-3">
        <Link
          href="/prompts"
          className={cn(
            'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            pathname === '/prompts' && !activeFolderId && !activeTagId
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          All Prompts
        </Link>

        {folders.length > 0 && (
          <div className="mt-3">
            <Link
              href="/prompts/folders"
              className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Folders
            </Link>
            <div className="mt-1 space-y-0.5">
              {folders.map((folder) => (
                <Link
                  key={folder.id}
                  href={filterLink('folderId', folder.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                    activeFolderId === folder.id
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{folder.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-3">
            <Link
              href="/prompts/tags"
              className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              <Tag className="h-3.5 w-3.5" />
              Tags
            </Link>
            <div className="mt-1 space-y-0.5">
              {tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={filterLink('tagId', tag.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                    activeTagId === tag.id
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                  <span className="truncate">{tag.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 border-t border-border pt-2 space-y-0.5">
          <Link
            href="/prompts/folders"
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === '/prompts/folders'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <FolderOpen className="h-4 w-4 shrink-0" />
            Manage Folders
          </Link>
          <Link
            href="/prompts/tags"
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === '/prompts/tags'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Tag className="h-4 w-4 shrink-0" />
            Manage Tags
          </Link>
        </div>
      </nav>
    </aside>
  )
}
