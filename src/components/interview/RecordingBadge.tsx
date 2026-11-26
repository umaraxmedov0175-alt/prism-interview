'use client';

interface RecordingBadgeProps {
  recording: boolean;
}

export function RecordingBadge({ recording }: RecordingBadgeProps) {
  if (!recording) return null;

  return (
    <span
      role="status"
      aria-label="Recording active"
      className="inline-flex items-center gap-1.5 rounded-[999px] border border-danger/30 bg-danger/10 px-2.5 py-0.5 text-xs font-medium text-danger"
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-danger" aria-hidden="true" />
      REC
    </span>
  );
}
