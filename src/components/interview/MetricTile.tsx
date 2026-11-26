interface MetricTileProps {
  label: string;
  value: string | number;
  target?: string;
}

export function MetricTile({ label, value, target }: MetricTileProps) {
  return (
    <div className="rounded-[8px] border border-border bg-bg p-3.5">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 font-mono text-xl font-semibold text-text">{value}</p>
      {target && <p className="mt-0.5 text-[11px] text-text-muted">Target: {target}</p>}
    </div>
  );
}
