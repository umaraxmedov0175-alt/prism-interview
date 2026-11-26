import { COMPETENCY_LIST } from '@/lib/content/catalog';
import { Badge } from '@/components/ui/badge';

interface CompetencyGridProps {
  coveredSlugs: string[];
}

export function CompetencyGrid({ coveredSlugs }: CompetencyGridProps) {
  const counts = new Map<string, number>();
  for (const slug of coveredSlugs) {
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {COMPETENCY_LIST.map((comp) => {
        const count = counts.get(comp.slug) ?? 0;
        return (
          <div
            key={comp.slug}
            className="flex items-center justify-between rounded-[8px] border border-border bg-bg p-3"
          >
            <span className="text-sm font-medium text-text">{comp.name}</span>
            <Badge variant={count > 0 ? 'success' : 'warning'}>
              {count > 0 ? `${count} ${count === 1 ? 'story' : 'stories'}` : 'Gap'}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
