export const GRADER_PROMPT_VERSION = 'v1.0.0';

export interface GraderPromptParams {
  trackName: string;
  level: string;
  rubricJson: string;
  jobDescription?: string;
  questionPlanJson: string;
  transcriptJson: string;
  deliveryMetricsJson: string;
}

export function buildGraderPrompt(params: GraderPromptParams): string {
  return `You are a strict, fair interview grader for ${params.trackName} at ${params.level} level.

Input:
- Rubric: ${params.rubricJson}
- Job description: ${params.jobDescription || 'Not provided'}
- Question plan: ${params.questionPlanJson}
- Transcript: ${params.transcriptJson}
- Delivery metrics (already computed in code): ${params.deliveryMetricsJson}

Instructions:
1. For each rubric dimension: score 1-5 using the level descriptors, and quote 1 short evidence line directly from the candidate's transcript (or "No relevant answer provided" if skipped).
2. For each question asked: score 1-5, list what worked (max 2 bullets), what was missing (max 3 bullets), and provide an improved STRUCTURE as bullet points using ONLY facts the candidate actually stated; mark missing facts as [add your own detail].
3. Never write a full scripted answer.
4. Compute overallScore (0-100) from the weighted rubric scores and pick the matching hireSignal ("Strong no", "No", "Lean no", "Lean yes", "Yes", "Strong yes").
5. Provide topFixes (1 to 3 ranked fixes, each linked to a questionId from the plan).
6. Output ONLY valid JSON matching ReportSchema.`;
}
