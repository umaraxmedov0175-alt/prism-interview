'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const CONSENT_KEY = 'prism_cookie_consent_v1';

export function CookieBanner() {
  const [choice, setChoice] = useState<'accepted' | 'rejected' | null>('accepted');

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved === 'accepted' || saved === 'rejected') {
      setChoice(saved);
    } else {
      setChoice(null);
    }
  }, []);

  if (choice !== null) return null;

  function handleChoice(value: 'accepted' | 'rejected') {
    localStorage.setItem(CONSENT_KEY, value);
    setChoice(value);
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-4 right-4 left-4 z-50 flex flex-col justify-between gap-3 rounded-[12px] border border-border bg-surface p-3.5 shadow-lg sm:left-auto sm:max-w-sm"
    >
      <p className="text-xs text-text-muted">
        We use essential storage for your practice sessions and optional analytics only if you
        accept.
      </p>
      <div className="flex shrink-0 items-center gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => handleChoice('rejected')}>
          Reject
        </Button>
        <Button type="button" size="sm" onClick={() => handleChoice('accepted')}>
          Accept
        </Button>
      </div>
    </div>
  );
}
