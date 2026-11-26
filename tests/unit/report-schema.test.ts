import { describe, it, expect } from 'vitest';
import { ReportSchema } from '@/lib/ai/schemas/report';

describe('ReportSchema', () => {
  it('validates a compliant report payload', () => {
    const valid = {
      overallScore: 82,
      hireSignal: 'Yes',
      rubricScores: [
        {
          dimension: 'Structure / STAR',
          weight: 20,
          score: 4,
          evidenceQuote: 'I owned the checkout migration from start to finish.',
        },
      ],
      perQuestion: [
        {
          questionId: 'beh-1',
          questionText: 'Tell me about a conflict.',
          userTranscript: 'I worked with the lead engineer...',
          score: 4,
          whatWorked: ['Clear personal ownership'],
          whatWasMissing: ['Could add final latency metric'],
          improvedStructureOutline: [
            'Situation: Checkout API latency spiked',
            'Action: I proposed caching [add your own detail]',
          ],
        },
      ],
      contentMetrics: {
        starCompletenessPct: 80,
        roleKeywordsCovered: ['latency', 'migration'],
        specificityRating: 'high',
      },
      topFixes: [
        {
          rank: 1,
          title: 'Quantify final impact',
          reason: 'Add exact before/after numbers.',
          questionId: 'beh-1',
        },
      ],
    };

    expect(() => ReportSchema.parse(valid)).not.toThrow();
  });

  it('rejects out-of-range scores', () => {
    expect(() =>
      ReportSchema.parse({
        overallScore: 150,
        hireSignal: 'Yes',
        rubricScores: [],
        perQuestion: [],
        contentMetrics: { starCompletenessPct: 50, roleKeywordsCovered: [], specificityRating: 'low' },
        topFixes: [],
      })
    ).toThrow();
  });
});
