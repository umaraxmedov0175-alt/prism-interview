import { Skeleton } from '@/components/ui/skeleton';

export function PageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading content">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 w-full rounded-[12px]" />
        <Skeleton className="h-32 w-full rounded-[12px]" />
        <Skeleton className="h-32 w-full rounded-[12px]" />
      </div>
      <Skeleton className="h-64 w-full rounded-[12px]" />
    </div>
  );
}
