import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {icon && (
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg text-text-muted">
            {icon}
          </div>
        )}
        <h3 className="text-base font-semibold text-text">{title}</h3>
        <p className="mt-1.5 max-w-md text-sm text-text-muted">{description}</p>
        {action && <div className="mt-5">{action}</div>}
      </CardContent>
    </Card>
  );
}
