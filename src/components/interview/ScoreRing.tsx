import { Badge } from '@/components/ui/badge';

interface ScoreRingProps {
  score: number;
  hireSignal: string;
}

export function ScoreRing({ score, hireSignal }: ScoreRingProps) {
  const variant =
    score >= 70 ? 'success' : score >= 50 ? 'warning' : 'danger';

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary/25 bg-bg">
        <div className="text-center">
          <span className="font-mono text-2xl font-semibold text-text">{score}</span>
          <span className="block text-[10px] text-text-muted">/ 100</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-text-muted">Hire signal</p>
        <Badge variant={variant}>{hireSignal}</Badge>
      </div>
    </div>
  );
}
