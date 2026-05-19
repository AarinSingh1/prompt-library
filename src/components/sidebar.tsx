'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { FolderOpen, Home, Tag } from 'lucide-react'

const navItems = [
  { href: '/prompts', label: 'All Prompts', icon: Home },
  { href: '/prompts/folders', label: 'Folders', icon: FolderOpen },
  { href: '/prompts/tags', label: 'Tags', icon: Tag },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-background">
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
