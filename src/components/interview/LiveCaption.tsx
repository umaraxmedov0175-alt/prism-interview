'use client';

import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LiveCaptionProps {
  speaker: 'ai' | 'user' | null;
  text: string;
  visible: boolean;
  onToggle: () => void;
}

export function LiveCaption({ speaker, text, visible, onToggle }: LiveCaptionProps) {
  return (
    <div className="rounded-[8px] border border-border bg-bg p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-text-muted">Live Captions</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onToggle}
          aria-label={visible ? 'Hide captions' : 'Show captions'}
          className="h-7 px-2 text-xs"
        >
          {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {visible ? 'Hide' : 'Show'}
        </Button>
      </div>
      {visible && (
        <p className="mt-1.5 min-h-[1.5rem] text-sm text-text">
          {text ? (
            <>
              <span className="mr-1.5 font-medium text-primary">
                {speaker === 'ai' ? 'Interviewer:' : 'You:'}
              </span>
              {text}
            </>
          ) : (
            <span className="text-text-muted">Waiting for speech...</span>
          )}
        </p>
      )}
    </div>
  );
}
