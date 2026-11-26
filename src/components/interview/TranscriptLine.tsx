interface TranscriptLineProps {
  speaker: 'ai' | 'user';
  text: string;
}

const FILLER_REGEX = /\b(um|uh|like|you know|basically|actually)\b/gi;

export function TranscriptLine({ speaker, text }: TranscriptLineProps) {
  if (speaker === 'ai') {
    return (
      <div className="rounded-[8px] border border-border bg-surface p-3.5">
        <p className="text-xs font-medium text-primary">Interviewer</p>
        <p className="mt-1 text-sm text-text">{text}</p>
      </div>
    );
  }

  const parts = text.split(FILLER_REGEX);

  return (
    <div className="rounded-[8px] border border-border bg-bg p-3.5">
      <p className="text-xs font-medium text-text-muted">You</p>
      <p className="mt-1 text-sm text-text">
        {parts.map((part, idx) =>
          FILLER_REGEX.test(part) ? (
            <mark
              key={idx}
              className="rounded bg-warning/20 px-1 text-text underline decoration-warning"
            >
              {part}
            </mark>
          ) : (
            <span key={idx}>{part}</span>
          )
        )}
      </p>
    </div>
  );
}
