import { NextResponse } from 'next/server';
import { z } from 'zod';
import { gradeSession } from '@/lib/ai/grader';

const EndSessionSchema = z.object({
  trackSlug: z.string(),
  level: z.string().default('mid'),
  jobDescription: z.string().optional(),
  questionPlan: z.array(
    z.object({
      id: z.string(),
      trackSlug: z.string().default('behavioral'),
      category: z.string().default('General'),
      text: z.string(),
      whyAsked: z.string().default(''),
      followUps: z.array(z.string()).default([]),
    })
  ),
  turns: z.array(
    z.object({
      speaker: z.enum(['ai', 'user']),
      text: z.string(),
      startMs: z.number(),
      endMs: z.number(),
    })
  ),
});

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = EndSessionSchema.parse(body);

    const result = await gradeSession({
      trackSlug: parsed.trackSlug,
      level: parsed.level,
      jobDescription: parsed.jobDescription,
      questionPlan: parsed.questionPlan,
      turns: parsed.turns,
    });

    return NextResponse.json({
      id: crypto.randomUUID(),
      sessionId: id,
      status: 'done',
      createdAt: new Date().toISOString(),
      ...result,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to grade session' },
      { status: 500 }
    );
  }
}
