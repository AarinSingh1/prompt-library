'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react'

interface Folder {
  id: string
  name: string
  _count: { prompts: number }
}

export function FolderManager({ folders }: { folders: Folder[] }) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [editFolder, setEditFolder] = useState<Folder | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    const res = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })
    setLoading(false)
    if (!res.ok) { toast.error('Failed to create folder'); return }
    toast.success('Folder created')
    setName('')
    setCreateOpen(false)
    router.refresh()
  }

  async function handleRename() {
    if (!editFolder || !name.trim()) return
    setLoading(true)
    const res = await fetch(`/api/folders/${editFolder.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })
    setLoading(false)
    if (!res.ok) { toast.error('Failed to rename folder'); return }
    toast.success('Folder renamed')
    setEditFolder(null)
    setName('')
    router.refresh()
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/folders/${id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Failed to delete folder'); return }
    toast.success('Folder deleted')
    router.refresh()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Folders</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger>
            <Button size="sm" onClick={() => { setName(''); setCreateOpen(true) }}>
              <Plus className="h-4 w-4 mr-1.5" /> New folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create folder</DialogTitle></DialogHeader>
            <Input placeholder="Folder name" value={name} onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()} autoFocus />
            <Button onClick={handleCreate} disabled={loading || !name.trim()}>
              {loading ? 'Creating…' : 'Create'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">No folders yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
              <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1 text-sm font-medium">{folder.name}</span>
              <span className="text-xs text-muted-foreground">{folder._count.prompts} prompts</span>
              <Dialog open={editFolder?.id === folder.id} onOpenChange={(o) => { if (!o) setEditFolder(null) }}>
                <DialogTrigger>
                  <Button size="icon-sm" variant="ghost" onClick={() => { setEditFolder(folder); setName(folder.name) }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Rename folder</DialogTitle></DialogHeader>
                  <Input value={name} onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename()} autoFocus />
                  <Button onClick={handleRename} disabled={loading || !name.trim()}>
                    {loading ? 'Saving…' : 'Save'}
                  </Button>
                </DialogContent>
              </Dialog>
              <Button size="icon-sm" variant="ghost" onClick={() => handleDelete(folder.id)}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
