import { describe, it, expect } from 'vitest';
import { computeDeliveryMetrics } from '@/lib/metrics/delivery';

describe('computeDeliveryMetrics', () => {
  it('computes WPM, filler words, hedging words, and I/we counts deterministically', () => {
    const metrics = computeDeliveryMetrics([
      {
        speaker: 'ai',
        text: 'Tell me about a time you resolved a conflict.',
        startMs: 0,
        endMs: 5000,
      },
      {
        speaker: 'user',
        text: 'Um I think we had a disagreement, like, I led the migration and reduced latency by 40 percent.',
        startMs: 5000,
        endMs: 35000, // 30s = 0.5 min
      },
    ]);

    expect(metrics.totalUserWords).toBe(18);
    expect(metrics.wordsPerMinute).toBe(36);
    expect(metrics.fillerCount).toBe(2); // um, like
    expect(metrics.hedgingCount).toBe(1); // i think
    expect(metrics.iCount).toBe(2); // I, I
    expect(metrics.weCount).toBe(1); // we
    expect(metrics.avgAnswerLengthSec).toBe(30);
    expect(metrics.talkToListenRatio).toBe(86); // 30s / 35s
  });

  it('detects long pauses (> 2000ms) from wordTimestamps', () => {
    const metrics = computeDeliveryMetrics([
      {
        speaker: 'user',
        text: 'First part second part',
        startMs: 0,
        endMs: 6000,
        wordTimestamps: [
          { word: 'First', startMs: 0, endMs: 400 },
          { word: 'part', startMs: 450, endMs: 800 },
          { word: 'second', startMs: 3500, endMs: 4000 }, // 2700ms gap
          { word: 'part', startMs: 4100, endMs: 4500 },
        ],
      },
    ]);

    expect(metrics.longPauseCount).toBe(1);
    expect(metrics.longestPauseMs).toBe(2700);
  });
});
