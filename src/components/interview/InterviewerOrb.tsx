'use client';

import { motion } from 'framer-motion';

interface InterviewerOrbProps {
  speaking: boolean;
  name?: string;
}

export function InterviewerOrb({ speaking, name = 'AI Interviewer' }: InterviewerOrbProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-11 w-11 items-center justify-center">
        <motion.div
          animate={
            speaking
              ? { scale: [1, 1.18, 1], opacity: [0.45, 0.8, 0.45] }
              : { scale: 1, opacity: 0.2 }
          }
          transition={{ duration: 1.2, repeat: speaking ? Infinity : 0, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full bg-primary"
          aria-hidden="true"
        />
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-xs font-semibold text-primary">
          AI
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-text">{name}</p>
        <p className="text-xs text-text-muted">{speaking ? 'Speaking...' : 'Listening'}</p>
      </div>
    </div>
  );
}
