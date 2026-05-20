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

interface PromptFormProps {
  defaultValues?: Partial<PromptFormData>
  promptId?: string
}

export function PromptForm({ defaultValues, promptId }: PromptFormProps) {
  const router = useRouter()
  const isEditing = !!promptId

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: defaultValues ?? { title: '', content: '', description: '' },
  })

  async function onSubmit(data: PromptFormData) {
    const url = isEditing ? `/api/prompts/${promptId}` : '/api/prompts'
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      toast.error(isEditing ? 'Failed to update prompt' : 'Failed to create prompt')
      return
    }

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
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="content">Prompt</Label>
        <Textarea
          id="content"
          placeholder="Write your prompt here..."
          className="min-h-[200px] font-mono text-sm"
          {...register('content')}
        />
        {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create prompt'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
