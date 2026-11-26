interface RubricBarProps {
  dimension: string;
  weight: number;
  score: number;
  evidenceQuote: string;
}

export function RubricBar({ dimension, weight, score, evidenceQuote }: RubricBarProps) {
  const colorClass =
    score >= 4 ? 'bg-success' : score === 3 ? 'bg-warning' : 'bg-danger';

  return (
    <div className="space-y-1.5 rounded-[8px] border border-border bg-bg p-3.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="font-medium text-text">
          {dimension}{' '}
          <span className="text-xs font-normal text-text-muted">({weight}%)</span>
        </span>
        <span className="font-mono font-semibold text-text">{score} / 5</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full ${colorClass}`}
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <p className="text-xs text-text-muted">“{evidenceQuote}”</p>
    </div>
  );
}
