'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="border-danger/30">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-danger/30 bg-danger/10 text-danger">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-text">{title}</h3>
        <p className="mt-1.5 max-w-md text-sm text-text-muted">{description}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-5">
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
