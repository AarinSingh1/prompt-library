export default function PromptsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">All Prompts</h1>
        <p className="text-sm text-muted-foreground mt-1">Your saved prompts will appear here.</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm text-muted-foreground">No prompts yet.</p>
        <p className="text-xs text-muted-foreground mt-1">Create your first prompt to get started.</p>
      </div>
    </div>
  )
}
