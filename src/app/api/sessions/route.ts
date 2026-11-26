import { NextResponse } from 'next/server';
import { z } from 'zod';
import { buildQuestionPlan } from '@/lib/ai/question-planner';

const CreateSessionSchema = z.object({
  trackSlug: z.string().min(1),
  formatSlug: z.string().min(1).default('one-on-one-video'),
  level: z.string().min(1).default('mid'),
  role: z.string().min(1).default('Software Engineer'),
  companyName: z.string().optional(),
  jobDescription: z.string().optional(),
  durationMinutes: z.number().int().min(10).max(60).default(10),
  difficulty: z.enum(['warm-up', 'realistic', 'tough']).default('realistic'),
  persona: z.enum(['friendly', 'neutral', 'skeptical']).default('neutral'),
  interviewLanguage: z.string().default('en'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateSessionSchema.parse(body);
    const questionPlan = buildQuestionPlan({
      trackSlug: parsed.trackSlug,
      durationMinutes: parsed.durationMinutes,
      jobDescription: parsed.jobDescription,
    });

    const sessionId = crypto.randomUUID();

    return NextResponse.json({
      id: sessionId,
      ...parsed,
      questionPlan,
      status: 'live',
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid session setup payload' },
      { status: 400 }
    );
  }
}
