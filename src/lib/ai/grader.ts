import { getGeminiClient, getTextModel } from '@/lib/ai/client';
import { buildGraderPrompt, GRADER_PROMPT_VERSION } from '@/lib/ai/prompts/grader';
import { MVP_TRACKS, type SeedQuestion } from '@/lib/ai/question-bank';
import { ReportSchema, type ReportOutput } from '@/lib/ai/schemas/report';
import { computeDeliveryMetrics, type TranscriptTurnInput } from '@/lib/metrics/delivery';

export interface GradeSessionInput {
  trackSlug: string;
  level: string;
  jobDescription?: string;
  questionPlan: SeedQuestion[];
  turns: TranscriptTurnInput[];
}

export interface GradeSessionResult {
  report: ReportOutput;
  deliveryMetrics: ReturnType<typeof computeDeliveryMetrics>;
  modelVersion: string;
  promptVersion: string;
}

function buildFallbackReport(
  input: GradeSessionInput,
  delivery: ReturnType<typeof computeDeliveryMetrics>
): ReportOutput {
  const track = MVP_TRACKS.find((t) => t.slug === input.trackSlug) ?? MVP_TRACKS[0];
  const userTurns = input.turns.filter((t) => t.speaker === 'user' && t.text.trim().length > 0);
  const combinedText = userTurns.map((t) => t.text).join(' ');
  const hasNumbers = /\d+/.test(combinedText);
  const hasStrongI = delivery.iCount >= delivery.weCount;
  const wordCount = delivery.totalUserWords;

  const baseScore = wordCount === 0 ? 1 : wordCount < 40 ? 2 : wordCount < 100 ? 3 : 4;
  const specificityScore = wordCount === 0 ? 1 : hasNumbers ? Math.min(5, baseScore + 1) : Math.max(2, baseScore - 1);

  const rubricScores = track.rubric.map((dim, idx) => {
    const score =
      idx === 1
        ? specificityScore
        : idx === 2 && !hasStrongI
          ? Math.max(2, baseScore - 1)
          : baseScore;
    const sampleQuote =
      userTurns[idx % Math.max(1, userTurns.length)]?.text.slice(0, 120) ||
      'No relevant answer provided';
    return {
      dimension: dim.name,
      weight: dim.weight,
      score,
      evidenceQuote: sampleQuote,
    };
  });

  const weighted = rubricScores.reduce((acc, r) => acc + (r.score / 5) * r.weight, 0);
  const overallScore = Math.round(weighted);
  const hireSignal =
    overallScore >= 85
      ? 'Strong yes'
      : overallScore >= 72
        ? 'Yes'
        : overallScore >= 60
          ? 'Lean yes'
          : overallScore >= 45
            ? 'Lean no'
            : overallScore >= 30
              ? 'No'
              : 'Strong no';

  const perQuestion = input.questionPlan.map((q, idx) => {
    const answerTurn = userTurns[idx];
    const transcript = answerTurn?.text ?? '';
    const qScore = transcript.length === 0 ? 1 : /\d+/.test(transcript) ? 4 : 3;
    return {
      questionId: q.id,
      questionText: q.text,
      userTranscript: transcript || '(No response recorded)',
      score: qScore,
      whatWorked: transcript
        ? ['Directly addressed the prompt with a concrete situation.']
        : ['Question was presented in the session plan.'],
      whatWasMissing: [
        ...(hasNumbers ? [] : ['Include specific numbers or metrics to prove the outcome.']),
        'Clarify your exact individual action vs. the team.',
      ].slice(0, 3),
      improvedStructureOutline: [
        `Situation: ${transcript ? transcript.slice(0, 60) + '...' : '[add your own detail]'}`,
        'Task: State your specific responsibility [add your own detail]',
        'Action: List 2 concrete steps you personally drove [add your own detail]',
        'Result & Learning: State the measured outcome and what you would change [add your own detail]',
      ],
    };
  });

  return {
    overallScore,
    hireSignal,
    rubricScores,
    perQuestion,
    contentMetrics: {
      starCompletenessPct: Math.min(100, Math.round((overallScore / 100) * 95)),
      roleKeywordsCovered: input.jobDescription
        ? input.jobDescription
            .split(/\W+/)
            .filter((w) => w.length > 4 && combinedText.toLowerCase().includes(w.toLowerCase()))
            .slice(0, 6)
        : [],
      specificityRating: hasNumbers ? 'high' : wordCount > 60 ? 'medium' : 'low',
    },
    topFixes: [
      {
        rank: 1,
        title: hasNumbers ? 'Sharpen personal ownership ("I" vs "we")' : 'Add measurable outcomes & numbers',
        reason: hasNumbers
          ? 'Highlight the exact decisions and actions you personally drove.'
          : 'Concrete metrics (%, latency, revenue, time saved) raise specificity scores.',
        questionId: input.questionPlan[0]?.id ?? 'beh-1',
      },
      {
        rank: 2,
        title: 'Close every story with reflection',
        reason: 'End with one sentence on what you learned or would do differently.',
        questionId: input.questionPlan[Math.min(1, input.questionPlan.length - 1)]?.id ?? 'beh-1',
      },
    ],
  };
}

export async function gradeSession(input: GradeSessionInput): Promise<GradeSessionResult> {
  const deliveryMetrics = computeDeliveryMetrics(input.turns);
  const track = MVP_TRACKS.find((t) => t.slug === input.trackSlug) ?? MVP_TRACKS[0];
  const ai = getGeminiClient();

  if (!ai) {
    return {
      report: buildFallbackReport(input, deliveryMetrics),
      deliveryMetrics,
      modelVersion: 'local-deterministic-v1',
      promptVersion: GRADER_PROMPT_VERSION,
    };
  }

  const model = getTextModel();
  const prompt = buildGraderPrompt({
    trackName: track.name,
    level: input.level,
    rubricJson: JSON.stringify(track.rubric),
    jobDescription: input.jobDescription,
    questionPlanJson: JSON.stringify(input.questionPlan),
    transcriptJson: JSON.stringify(input.turns),
    deliveryMetricsJson: JSON.stringify(deliveryMetrics),
  });

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });
      const raw = response.text ?? '';
      const parsed = ReportSchema.parse(JSON.parse(raw));
      return {
        report: parsed,
        deliveryMetrics,
        modelVersion: model,
        promptVersion: GRADER_PROMPT_VERSION,
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    `Grader failed after 2 attempts: ${lastError instanceof Error ? lastError.message : 'Invalid JSON'}`
  );
}
