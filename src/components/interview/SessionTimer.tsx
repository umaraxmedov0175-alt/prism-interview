'use client';

import { Pause, Play, RotateCcw, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SessionTimerProps {
  elapsedSec: number;
  paused: boolean;
  onTogglePause: () => void;
  onRepeatQuestion: () => void;
  onEndInterview: () => void;
  ending: boolean;
}

export function SessionTimer({
  elapsedSec,
  paused,
  onTogglePause,
  onRepeatQuestion,
  onEndInterview,
  ending,
}: SessionTimerProps) {
  const mins = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const secs = String(elapsedSec % 60).padStart(2, '0');

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        aria-label="Session timer"
        className="rounded-[8px] border border-border bg-bg px-3 py-1.5 font-mono text-xs font-medium text-text"
      >
        {mins}:{secs}
      </span>
      <Button type="button" variant="outline" size="sm" onClick={onRepeatQuestion}>
        <RotateCcw className="h-3.5 w-3.5" />
        Repeat question
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onTogglePause}>
        {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        {paused ? 'Resume' : 'I need a moment'}
      </Button>
      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={onEndInterview}
        disabled={ending}
      >
        <Square className="h-3.5 w-3.5" />
        {ending ? 'Grading...' : 'End interview'}
      </Button>
    </div>
  );
}
