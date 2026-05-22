'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash2 } from 'lucide-react'

interface Tag {
  id: string
  name: string
  color: string
  _count: { prompts: number }
}

const PRESET_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4']

export function TagManager({ tags }: { tags: Tag[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), color }),
    })
    setLoading(false)
    if (!res.ok) { toast.error('Failed to create tag'); return }
    toast.success('Tag created')
    setName('')
    setColor('#6366f1')
    setOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/tags/${id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Failed to delete tag'); return }
    toast.success('Tag deleted')
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button size="sm" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> New tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create tag</DialogTitle></DialogHeader>
            <Input placeholder="Tag name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    className="h-6 w-6 rounded-full border-2 transition-transform hover:scale-110"
                    style={{ backgroundColor: c, borderColor: color === c ? 'white' : 'transparent', outline: color === c ? `2px solid ${c}` : 'none' }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
            <Button onClick={handleCreate} disabled={loading || !name.trim()}>
              {loading ? 'Creating…' : 'Create'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">No tags yet.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
              <Badge variant="secondary" style={{ backgroundColor: `${tag.color}20`, color: tag.color, borderColor: tag.color }}>
                {tag.name}
              </Badge>
              <span className="text-xs text-muted-foreground">{tag._count.prompts}</span>
              <Button size="icon-sm" variant="ghost" onClick={() => handleDelete(tag.id)}>
                <Trash2 className="h-3 w-3 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
