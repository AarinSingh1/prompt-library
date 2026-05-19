'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CopyButton } from '@/components/copy-button'
import { Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PromptOptimizerProps {
  promptId: string
  originalContent: string
}

export function PromptOptimizer({ promptId, originalContent }: PromptOptimizerProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [optimized, setOptimized] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [rating, setRating] = useState<1 | -1 | null>(null)

  async function runOptimization() {
    setOpen(true)
    setOptimized('')
    setDone(false)
    setRating(null)
    setStreaming(true)

    const res = await fetch('/api/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: originalContent }),
    })

    if (!res.ok || !res.body) {
      toast.error('Optimization failed')
      setStreaming(false)
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let text = ''

    while (true) {
      const { done: rdone, value } = await reader.read()
      if (rdone) break
      text += decoder.decode(value, { stream: true })
      setOptimized(text)
    }

    setStreaming(false)
    setDone(true)
  }

  async function handleSave(mode: 'replace' | 'new-version') {
    setSaving(true)
    const res = await fetch(`/api/prompts/${promptId}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optimizedContent: optimized, mode, rating }),
    })
    setSaving(false)

    if (!res.ok) { toast.error('Failed to save'); return }

    toast.success(mode === 'replace' ? 'Prompt updated with optimized version' : 'Saved as new version')
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="mt-6">
      {!open ? (
        <Button variant="outline" onClick={runOptimization}>
          <Sparkles className="h-4 w-4 mr-1.5 text-violet-500" />
          Optimize with AI
        </Button>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
            <span className="text-sm font-semibold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-violet-500" />
              AI Optimization
            </span>
            {!streaming && (
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Close</Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            {/* Original */}
            <div className="p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Original</p>
              <p className="font-mono text-sm whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {originalContent}
              </p>
            </div>

            {/* Optimized */}
            <div className="p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                Optimized
                {streaming && (
                  <span className="inline-block h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                )}
              </p>
              {optimized ? (
                <p className="font-mono text-sm whitespace-pre-wrap leading-relaxed">{optimized}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Generating…</p>
              )}
            </div>
          </div>

          {done && (
            <>
              <Separator />
              <div className="px-4 py-3 flex items-center gap-3 flex-wrap bg-muted/30">
                {/* Rating */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span>Rate this:</span>
                  <button
                    onClick={() => setRating(rating === 1 ? null : 1)}
                    className={cn('rounded p-1 transition-colors hover:bg-accent', rating === 1 && 'text-green-500')}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setRating(rating === -1 ? null : -1)}
                    className={cn('rounded p-1 transition-colors hover:bg-accent', rating === -1 && 'text-red-500')}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <CopyButton text={optimized} />
                  <Button variant="outline" size="sm" onClick={() => handleSave('new-version')} disabled={saving}>
                    Save as new version
                  </Button>
                  <Button size="sm" onClick={() => handleSave('replace')} disabled={saving}>
                    {saving ? 'Saving…' : 'Replace current'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
