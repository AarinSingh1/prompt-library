'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileSidebarTrigger() {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="md:hidden"
      onClick={() => document.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}

export function MobileSidebarOverlay({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  if (typeof document !== 'undefined') {
    document.addEventListener('toggle-mobile-sidebar', () => setOpen((o) => !o), { once: true })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-200',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setOpen(false)}
      />
      {/* Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transition-transform duration-200 md:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-border">
          <span className="font-semibold text-sm">Menu</span>
          <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-3.5rem)]">
          {children}
        </div>
      </div>
    </>
  )
}
