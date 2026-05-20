import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { PromptForm } from '@/components/prompt-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPromptPage({ params }: PageProps) {
  const session = await auth()
  const { id } = await params

  const prompt = await db.prompt.findFirst({
    where: { id, userId: session!.user.id },
  })

  if (!prompt) notFound()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Prompt</h1>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">{prompt.title}</p>
      </div>
      <PromptForm
        promptId={prompt.id}
        defaultValues={{
          title: prompt.title,
          content: prompt.content,
          description: prompt.description ?? '',
        }}
      />
    </div>
  )
}
