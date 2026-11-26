import { NextResponse } from 'next/server';
import { GoogleGenAI, Modality } from '@google/genai';
import { getLiveModel } from '@/lib/ai/client';

export async function POST() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = getLiveModel();

  if (!apiKey) {
    return NextResponse.json({
      mode: 'browser-speech',
      model,
      token: null,
    });
  }

  try {
    const client = new GoogleGenAI({
      apiKey,
      httpOptions: { apiVersion: 'v1beta' },
    });

    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const newSessionExpireTime = new Date(Date.now() + 60 * 1000).toISOString();

    const token = await client.authTokens.create({
      config: {
        uses: 1,
        expireTime,
        newSessionExpireTime,
        liveConnectConstraints: {
          model,
          config: {
            sessionResumption: {},
            responseModalities: [Modality.AUDIO],
          },
        },
      },
    });

    return NextResponse.json({
      mode: 'gemini-live',
      model,
      token: token.name,
      expireTime,
    });
  } catch (err) {
    return NextResponse.json(
      {
        mode: 'browser-speech',
        model,
        token: null,
        warning: err instanceof Error ? err.message : 'Ephemeral token creation failed',
      },
      { status: 200 }
    );
  }
}
