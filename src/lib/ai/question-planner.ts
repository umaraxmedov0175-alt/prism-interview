import { MVP_QUESTIONS, type SeedQuestion } from '@/lib/ai/question-bank';

export function buildQuestionPlan(params: {
  trackSlug: string;
  durationMinutes: number;
  jobDescription?: string;
}): SeedQuestion[] {
  const pool = MVP_QUESTIONS.filter((q) => q.trackSlug === params.trackSlug);
  const candidates = pool.length > 0 ? pool : MVP_QUESTIONS.filter((q) => q.trackSlug === 'behavioral');

  const targetCount = params.durationMinutes <= 10 ? 3 : params.durationMinutes <= 20 ? 4 : 5;

  if (params.jobDescription && params.jobDescription.trim().length > 0) {
    const jdWords = new Set(
      params.jobDescription
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3)
    );
    const scored = [...candidates].sort((a, b) => {
      const scoreA = a.text
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => jdWords.has(w)).length;
      const scoreB = b.text
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => jdWords.has(w)).length;
      return scoreB - scoreA;
    });
    return scored.slice(0, Math.min(targetCount, scored.length));
  }

  return candidates.slice(0, Math.min(targetCount, candidates.length));
}
