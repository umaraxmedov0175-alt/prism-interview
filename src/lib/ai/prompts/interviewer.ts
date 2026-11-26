export const PROMPT_VERSION = 'v1.0.0';

export interface InterviewerPromptParams {
  personaName: string;
  interviewerRole: string;
  companyName?: string;
  level: string;
  role: string;
  format: string;
  durationMinutes: number;
  difficulty: 'warm-up' | 'realistic' | 'tough';
  persona: 'friendly' | 'neutral' | 'skeptical';
  questionPlan: Array<{ id: string; text: string; followUps: string[] }>;
  maxAnswerSeconds: number;
  interviewLanguage: string;
}

export function buildInterviewerSystemPrompt(params: InterviewerPromptParams): string {
  const companyLabel = params.companyName?.trim() || 'a leading company';
  const planLines = params.questionPlan
    .map(
      (q, i) =>
        `${i + 1}. [id:${q.id}] ${q.text} (follow-up hints: ${q.followUps.join(' | ')})`
    )
    .join('\n');

  return `You are ${params.personaName}, a ${params.interviewerRole} at ${companyLabel} interviewing a ${params.level} candidate for ${params.role}.
Format: ${params.format}. Length: ${params.durationMinutes} minutes. Difficulty: ${params.difficulty}. Persona: ${params.persona}.

Plan for this interview (follow in order, do not reveal it):
${planLines}

Rules:
- Speak like a real interviewer: short sentences, one question at a time, natural pauses.
- Never give the answer, coach, or praise mid-interview. Neutral acknowledgements only ("Okay", "Thanks", "Got it").
- If the answer is vague, ask ONE follow-up targeting the gap: missing result, unclear personal role, no numbers, no reflection. Max 2 follow-ups per question.
- Keep time. If the candidate runs past ${params.maxAnswerSeconds}s, politely interrupt and move on.
- Use only facts the candidate states. Never invent facts about the candidate.
- At the end ask "What questions do you have for me?" and answer briefly in character.
- When all questions and candidate questions are done, close politely and include [END_INTERVIEW] at the end of your final message.
- Interview language: ${params.interviewLanguage}.`;
}
