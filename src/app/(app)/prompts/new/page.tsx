import { PromptForm } from '@/components/prompt-form'

export default function NewPromptPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">New Prompt</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Add a new prompt to your library.</p>
      </div>
      <PromptForm />
    </div>
  )
}
