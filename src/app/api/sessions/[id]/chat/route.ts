import { z } from 'zod';
import { getGeminiClient, getTextModel } from '@/lib/ai/client';
import { buildInterviewerSystemPrompt } from '@/lib/ai/prompts/interviewer';

const ChatRequestSchema = z.object({
  trackSlug: z.string(),
  level: z.string(),
  role: z.string(),
  companyName: z.string().optional(),
  formatSlug: z.string().default('one-on-one-video'),
  durationMinutes: z.number().default(10),
  difficulty: z.enum(['warm-up', 'realistic', 'tough']).default('realistic'),
  persona: z.enum(['friendly', 'neutral', 'skeptical']).default('neutral'),
  interviewLanguage: z.string().default('en'),
  questionPlan: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      followUps: z.array(z.string()).default([]),
    })
  ),
  turns: z.array(
    z.object({
      speaker: z.enum(['ai', 'user']),
      text: z.string(),
    })
  ),
});

function buildFallbackReply(input: z.infer<typeof ChatRequestSchema>): string {
  const userTurns = input.turns.filter((t) => t.speaker === 'user');
  const aiTurns = input.turns.filter((t) => t.speaker === 'ai');

  if (aiTurns.length === 0) {
    const firstQ = input.questionPlan[0]?.text ?? 'Tell me about a challenging project you led.';
    return `Hi, thanks for joining today. I'm excited to learn about your background for the ${input.level} ${input.role} role. Let's jump right in: ${firstQ}`;
  }

  const lastUser = userTurns[userTurns.length - 1]?.text ?? '';
  const hasNumbers = /\d+/.test(lastUser);
  const lastAi = aiTurns[aiTurns.length - 1]?.text ?? '';

  // Check if we should ask a follow-up for vague/short answers (max 1 follow-up in fallback)
  const alreadyFollowedUp =
    lastAi.includes('specific individual role') ||
    lastAi.includes('measurable') ||
    lastAi.includes('differently');

  if (!alreadyFollowedUp && (lastUser.split(/\s+/).length < 25 || !hasNumbers)) {
    return 'Thanks. Could you share your specific individual role there, and any measurable outcome or numbers?';
  }

  // Advance to next question based on how many main questions have been asked
  const askedCount = userTurns.length;
  const nextIndex = Math.min(input.questionPlan.length, Math.ceil(askedCount / 2));

  if (nextIndex < input.questionPlan.length) {
    return `Got it, thanks for sharing that. Moving on: ${input.questionPlan[nextIndex].text}`;
  }

  if (!lastAi.includes('What questions do you have for me?')) {
    return 'That wraps up my questions. Before we close, what questions do you have for me?';
  }

  return 'Great question—our team focuses heavily on rapid iteration and clear ownership. Thanks for your time today; we will follow up soon. [END_INTERVIEW]';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ChatRequestSchema.parse(body);
    const ai = getGeminiClient();

    if (!ai) {
      const reply = buildFallbackReply(parsed);
      return new Response(reply, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const systemInstruction = buildInterviewerSystemPrompt({
      personaName: 'Alex',
      interviewerRole: parsed.trackSlug === 'general-hr' ? 'Recruiter' : 'Senior Interviewer',
      companyName: parsed.companyName,
      level: parsed.level,
      role: parsed.role,
      format: parsed.formatSlug,
      durationMinutes: parsed.durationMinutes,
      difficulty: parsed.difficulty,
      persona: parsed.persona,
      questionPlan: parsed.questionPlan,
      maxAnswerSeconds: 150,
      interviewLanguage: parsed.interviewLanguage,
    });

    const historyText =
      parsed.turns.length === 0
        ? 'Start the interview with a brief greeting and ask the first question from the plan.'
        : parsed.turns.map((t) => `${t.speaker === 'ai' ? 'Interviewer' : 'Candidate'}: ${t.text}`).join('\n');

    const stream = await ai.models.generateContentStream({
      model: getTextModel(),
      contents: historyText,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Chat error' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
