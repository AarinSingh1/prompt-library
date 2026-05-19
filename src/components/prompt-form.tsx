'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { promptSchema, type PromptFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'

interface Folder { id: string; name: string }
interface Tag { id: string; name: string; color: string }

interface PromptFormProps {
  defaultValues?: Partial<PromptFormData>
  promptId?: string
  folders?: Folder[]
  tags?: Tag[]
}

export function PromptForm({ defaultValues, promptId, folders = [], tags = [] }: PromptFormProps) {
  const router = useRouter()
  const isEditing = !!promptId

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: { title: '', content: '', description: '', tagIds: [], ...defaultValues },
  })

  const selectedTagIds = watch('tagIds') ?? []
  const selectedFolderId = watch('folderId')

  function toggleTag(tagId: string) {
    const current = selectedTagIds
    setValue('tagIds', current.includes(tagId) ? current.filter((t) => t !== tagId) : [...current, tagId])
  }

  async function onSubmit(data: PromptFormData) {
    const url = isEditing ? `/api/prompts/${promptId}` : '/api/prompts'
    const method = isEditing ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { toast.error(isEditing ? 'Failed to update prompt' : 'Failed to create prompt'); return }
    const prompt = await res.json()
    toast.success(isEditing ? 'Prompt updated' : 'Prompt created')
    router.push(`/prompts/${prompt.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="e.g. Email rewriter" {...register('title')} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description <span className="text-muted-foreground">(optional)</span></Label>
        <Input id="description" placeholder="What does this prompt do?" {...register('description')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">Prompt</Label>
        <Textarea id="content" placeholder="Write your prompt here…" className="min-h-[200px] font-mono text-sm" {...register('content')} />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>

      {folders.length > 0 && (
        <div className="space-y-1.5">
          <Label>Folder <span className="text-muted-foreground">(optional)</span></Label>
          <div className="flex flex-wrap gap-2">
            <button type="button"
              onClick={() => setValue('folderId', undefined)}
              className={`rounded-md border px-3 py-1 text-sm transition-colors ${!selectedFolderId ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
            >
              None
            </button>
            {folders.map((f) => (
              <button type="button" key={f.id}
                onClick={() => setValue('folderId', f.id)}
                className={`rounded-md border px-3 py-1 text-sm transition-colors ${selectedFolderId === f.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-accent'}`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {tags.length > 0 && (
        <div className="space-y-1.5">
          <Label>Tags <span className="text-muted-foreground">(optional)</span></Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = selectedTagIds.includes(tag.id)
              return (
                <button type="button" key={tag.id} onClick={() => toggleTag(tag.id)}
                  className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${selected ? 'border-transparent text-white' : 'border-border text-muted-foreground hover:bg-accent'}`}
                  style={selected ? { backgroundColor: tag.color } : {}}
                >
                  {tag.name}
                  {selected && <X className="h-3 w-3" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create prompt'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
