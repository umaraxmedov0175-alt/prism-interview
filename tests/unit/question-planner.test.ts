import { describe, it, expect } from 'vitest';
import { buildQuestionPlan } from '@/lib/ai/question-planner';

describe('buildQuestionPlan', () => {
  it('returns 3 questions for a 10-minute behavioral session', () => {
    const plan = buildQuestionPlan({
      trackSlug: 'behavioral',
      durationMinutes: 10,
    });
    expect(plan).toHaveLength(3);
    expect(plan.every((q) => q.trackSlug === 'behavioral')).toBe(true);
  });

  it('prioritizes questions matching job description keywords', () => {
    const plan = buildQuestionPlan({
      trackSlug: 'software-engineering',
      durationMinutes: 10,
      jobDescription: 'Looking for an engineer experienced in idempotency and REST APIs.',
    });
    expect(plan.some((q) => q.id === 'swe-3')).toBe(true);
  });
});
