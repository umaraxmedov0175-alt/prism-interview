'use client';

import { useState } from 'react';
import Link from 'next/link';
import { computeDeliveryMetrics } from '@/lib/metrics/delivery';
import { Button } from '@/components/ui/button';

const SAMPLES: Record<
  string,
  {
    label: string;
    question: string;
    defaultAnswer: string;
    followUpNoNumbers: string;
    followUpWithNumbers: string;
  }
> = {
  behavioral: {
    label: 'Behavioral',
    question: 'Tell me about a time you disagreed with a teammate or manager.',
    defaultAnswer:
      'I disagreed with our lead on caching strategy, so I benchmarked both options and cut checkout p95 latency from 420ms to 115ms.',
    followUpNoNumbers:
      'What was your specific individual role, and what numbers changed after launch?',
    followUpWithNumbers:
      'Good concrete metric. What would you do differently if you faced that disagreement again?',
  },
  'system-design': {
    label: 'System Design',
    question: 'How would you design a rate limiter for a public API gateway?',
    defaultAnswer:
      'I would place a token-bucket limiter at the edge backed by Redis Lua scripts to handle 50k req/s with sub-2ms overhead.',
    followUpNoNumbers:
      'What target throughput and latency budget are you designing for, and how do you handle Redis failover?',
    followUpWithNumbers:
      'How do you handle a Redis shard failure without blocking legitimate traffic?',
  },
  consulting: {
    label: 'Consulting',
    question: 'A SaaS client saw net revenue retention drop from 118% to 104%. Where do you start?',
    defaultAnswer:
      'I would segment the 14-point drop between gross churn and contraction, then isolate which customer cohort drove 80% of the decline.',
    followUpNoNumbers:
      'Before diagnosing, what specific numbers would you request to split churn from contraction?',
    followUpWithNumbers:
      'Exhibit 1 shows SMB contraction doubled in Q3. What hypothesis would you test next?',
  },
};

export function HeroSandbox() {
  const [track, setTrack] = useState<'behavioral' | 'system-design' | 'consulting'>('behavioral');
  const [answer, setAnswer] = useState(SAMPLES.behavioral.defaultAnswer);

  const current = SAMPLES[track];
  const metrics = computeDeliveryMetrics([
    { speaker: 'ai', text: current.question, startMs: 0, endMs: 4000 },
    { speaker: 'user', text: answer, startMs: 4000, endMs: 18000 },
  ]);

  const hasNumbers = /\d+/.test(answer);
  const followUp = hasNumbers ? current.followUpWithNumbers : current.followUpNoNumbers;

  return (
    <div className="rounded-[12px] border border-border bg-surface">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-1" role="tablist" aria-label="Try a track">
          {(Object.keys(SAMPLES) as Array<keyof typeof SAMPLES>).map((key) => {
            const active = track === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setTrack(key as 'behavioral' | 'system-design' | 'consulting');
                  setAnswer(SAMPLES[key].defaultAnswer);
                }}
                className={`rounded-[8px] px-2.5 py-1 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-bg text-text shadow-xs border border-border'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {SAMPLES[key].label}
              </button>
            );
          })}
        </div>
        <span className="font-mono text-[11px] text-text-muted">Live rubric preview</span>
      </div>

      {/* Question + Interactive Answer */}
      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <p className="text-xs font-medium text-primary">Interviewer</p>
          <p className="text-sm font-medium text-text">{current.question}</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="hero-sandbox-input" className="block text-xs text-text-muted">
            Edit the answer below to watch follow-ups and metrics react
          </label>
          <textarea
            id="hero-sandbox-input"
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full rounded-[8px] border border-border bg-bg p-3 text-sm text-text focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {/* Adaptive Follow-up */}
        <div className="border-l-2 border-primary pl-3">
          <p className="text-xs font-medium text-text-muted">Adaptive follow-up</p>
          <p className="mt-0.5 text-sm text-text">{followUp}</p>
        </div>

        {/* Deterministic Telemetry */}
        <div className="grid grid-cols-3 divide-x divide-border rounded-[8px] border border-border bg-bg py-2.5 text-center">
          <div>
            <p className="text-[11px] text-text-muted">Numbers</p>
            <p className={`font-mono text-sm font-semibold ${hasNumbers ? 'text-success' : 'text-warning'}`}>
              {hasNumbers ? 'Detected' : 'Missing'}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-text-muted">Fillers</p>
            <p className="font-mono text-sm font-semibold text-text">{metrics.fillerPercentage}%</p>
          </div>
          <div>
            <p className="text-[11px] text-text-muted">I vs We</p>
            <p className="font-mono text-sm font-semibold text-text">
              {metrics.iCount} / {metrics.weCount}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-text-muted">100% free, no credit card</span>
          <Button size="sm" asChild>
            <Link href="/app/practice/new">Run full session</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
