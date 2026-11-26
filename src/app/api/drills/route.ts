import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getGeminiClient, getTextModel } from '@/lib/ai/client';
import { buildDrillPrompt } from '@/lib/ai/prompts/drill';
import { DrillFeedbackSchema } from '@/lib/ai/schemas/report';

const DrillRequestSchema = z.object({
  questionId: z.string().min(1),
  questionText: z.string().min(1),
  previousFeedback: z.string().optional(),
  attemptText: z.string().min(5),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = DrillRequestSchema.parse(body);
    const ai = getGeminiClient();

    if (!ai) {
      const hasNumbers = /\d+/.test(parsed.attemptText);
      const wordCount = parsed.attemptText.trim().split(/\s+/).length;
      const score = wordCount < 20 ? 2 : hasNumbers && wordCount >= 40 ? 4 : 3;

      return NextResponse.json({
        id: crypto.randomUUID(),
        questionId: parsed.questionId,
        feedback: {
          score,
          whatImproved: [
            wordCount >= 30
              ? 'Provided fuller context and clearer action steps.'
              : 'Attempted a direct response to the prompt.',
          ],
          stillMissing: [
            ...(hasNumbers ? [] : ['Add at least one concrete number or percentage.']),
            'Include a 1-sentence reflection on what you learned.',
          ],
          improvedStructureOutline: [
            `Situation & Task: ${parsed.attemptText.slice(0, 60)}...`,
            'Action: Highlight your own decision [add your own detail]',
            'Result: State the measurable outcome [add your own detail]',
          ],
        },
      });
    }

    const response = await ai.models.generateContent({
      model: getTextModel(),
      contents: buildDrillPrompt(parsed),
      config: { responseMimeType: 'application/json', temperature: 0.2 },
    });

    const feedback = DrillFeedbackSchema.parse(JSON.parse(response.text ?? '{}'));
    return NextResponse.json({
      id: crypto.randomUUID(),
      questionId: parsed.questionId,
      feedback,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Drill grading failed' },
      { status: 400 }
    );
  }
}
