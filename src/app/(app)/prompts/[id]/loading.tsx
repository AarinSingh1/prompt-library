import { Skeleton } from '@/components/ui/skeleton'

export default function PromptDetailLoading() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2 shrink-0">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="mt-4 flex gap-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-32 ml-auto" />
      </div>
      <Skeleton className="h-12 w-44 mt-6 rounded-md" />
    </div>
  )
}
