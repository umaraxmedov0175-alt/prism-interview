import { GoogleGenAI } from '@google/genai';

let cachedClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({ apiKey });
  }
  return cachedClient;
}

export function getTextModel(): string {
  return process.env.GEMINI_TEXT_MODEL || 'gemini-4-hydrogen';
}

export function getLiveModel(): string {
  return process.env.GEMINI_LIVE_MODEL || 'gemini-3.8-live';
}
