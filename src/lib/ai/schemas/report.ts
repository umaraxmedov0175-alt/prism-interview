import { z } from 'zod';

export const HireSignalSchema = z.enum([
  'Strong no',
  'No',
  'Lean no',
  'Lean yes',
  'Yes',
  'Strong yes',
]);

export const RubricScoreSchema = z.object({
  dimension: z.string().min(1),
  weight: z.number().min(0).max(100),
  score: z.number().int().min(1).max(5),
  evidenceQuote: z.string().min(1),
});

export const PerQuestionFeedbackSchema = z.object({
  questionId: z.string().min(1),
  questionText: z.string().min(1),
  userTranscript: z.string(),
  score: z.number().int().min(1).max(5),
  whatWorked: z.array(z.string()).max(2),
  whatWasMissing: z.array(z.string()).max(3),
  improvedStructureOutline: z.array(z.string()).min(1).max(6),
});

export const TopFixSchema = z.object({
  rank: z.number().int().min(1).max(3),
  title: z.string().min(1),
  reason: z.string().min(1),
  questionId: z.string().min(1),
});

export const ReportSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  hireSignal: HireSignalSchema,
  rubricScores: z.array(RubricScoreSchema).min(1),
  perQuestion: z.array(PerQuestionFeedbackSchema).min(1),
  contentMetrics: z.object({
    starCompletenessPct: z.number().int().min(0).max(100),
    roleKeywordsCovered: z.array(z.string()),
    specificityRating: z.enum(['low', 'medium', 'high']),
  }),
  topFixes: z.array(TopFixSchema).min(1).max(3),
});

export type ReportOutput = z.infer<typeof ReportSchema>;

export const DrillFeedbackSchema = z.object({
  score: z.number().int().min(1).max(5),
  whatImproved: z.array(z.string()).max(3),
  stillMissing: z.array(z.string()).max(3),
  improvedStructureOutline: z.array(z.string()).min(1).max(5),
});

export type DrillFeedbackOutput = z.infer<typeof DrillFeedbackSchema>;
