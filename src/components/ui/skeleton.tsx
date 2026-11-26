import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-[8px] bg-border/60', className)}
      aria-hidden="true"
      {...props}
    />
  );
}
