export interface TranscriptTurnInput {
  speaker: 'ai' | 'user';
  text: string;
  startMs: number;
  endMs: number;
  wordTimestamps?: Array<{ word: string; startMs: number; endMs: number }>;
}

export interface DeliveryMetrics {
  wordsPerMinute: number;
  totalUserWords: number;
  fillerCount: number;
  fillerPercentage: number;
  fillerBreakdown: Record<string, number>;
  hedgingCount: number;
  hedgingBreakdown: Record<string, number>;
  longPauseCount: number;
  longestPauseMs: number;
  avgAnswerLengthSec: number;
  talkToListenRatio: number;
  iCount: number;
  weCount: number;
}

const FILLER_WORDS = ['um', 'uh', 'like', 'you know', 'basically', 'actually'];
const HEDGING_PHRASES = ['i think', 'maybe', 'kind of', 'sort of', 'i guess'];

function countOccurrences(text: string, phrase: string): number {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
  return (text.match(regex) ?? []).length;
}

export function computeDeliveryMetrics(turns: TranscriptTurnInput[]): DeliveryMetrics {
  const userTurns = turns.filter((t) => t.speaker === 'user' && t.text.trim().length > 0);
  const aiTurns = turns.filter((t) => t.speaker === 'ai' && t.text.trim().length > 0);

  let totalUserWords = 0;
  let totalUserMs = 0;
  let totalAiMs = 0;

  const fillerBreakdown: Record<string, number> = {};
  const hedgingBreakdown: Record<string, number> = {};
  let fillerCount = 0;
  let hedgingCount = 0;
  let longPauseCount = 0;
  let longestPauseMs = 0;
  let iCount = 0;
  let weCount = 0;

  for (const turn of aiTurns) {
    totalAiMs += Math.max(0, turn.endMs - turn.startMs);
  }

  for (const turn of userTurns) {
    const words = turn.text.trim().split(/\s+/).filter(Boolean);
    totalUserWords += words.length;
    const durationMs = Math.max(1000, turn.endMs - turn.startMs);
    totalUserMs += durationMs;

    const lower = turn.text.toLowerCase();

    for (const filler of FILLER_WORDS) {
      const count = countOccurrences(lower, filler);
      if (count > 0) {
        fillerBreakdown[filler] = (fillerBreakdown[filler] ?? 0) + count;
        fillerCount += count;
      }
    }

    // Sentence-start "so"
    const sentenceStartSo = (lower.match(/(?:^|[.!?]\s+)so\b/g) ?? []).length;
    if (sentenceStartSo > 0) {
      fillerBreakdown['so (sentence start)'] =
        (fillerBreakdown['so (sentence start)'] ?? 0) + sentenceStartSo;
      fillerCount += sentenceStartSo;
    }

    for (const hedge of HEDGING_PHRASES) {
      const count = countOccurrences(lower, hedge);
      if (count > 0) {
        hedgingBreakdown[hedge] = (hedgingBreakdown[hedge] ?? 0) + count;
        hedgingCount += count;
      }
    }

    iCount += (lower.match(/\b(i|i'm|i've|i'd|my|me)\b/g) ?? []).length;
    weCount += (lower.match(/\b(we|we're|we've|we'd|our|us)\b/g) ?? []).length;

    if (turn.wordTimestamps && turn.wordTimestamps.length > 1) {
      for (let i = 1; i < turn.wordTimestamps.length; i++) {
        const gap = turn.wordTimestamps[i].startMs - turn.wordTimestamps[i - 1].endMs;
        if (gap > longestPauseMs) longestPauseMs = gap;
        if (gap > 2000) longPauseCount += 1;
      }
    }
  }

  const userMinutes = totalUserMs / 60000;
  const wordsPerMinute = userMinutes > 0 ? Math.round(totalUserWords / userMinutes) : 0;
  const fillerPercentage =
    totalUserWords > 0 ? Number(((fillerCount / totalUserWords) * 100).toFixed(1)) : 0;
  const avgAnswerLengthSec =
    userTurns.length > 0 ? Math.round(totalUserMs / 1000 / userTurns.length) : 0;
  const totalSpeakingMs = totalUserMs + totalAiMs;
  const talkToListenRatio =
    totalSpeakingMs > 0 ? Math.round((totalUserMs / totalSpeakingMs) * 100) : 0;

  return {
    wordsPerMinute,
    totalUserWords,
    fillerCount,
    fillerPercentage,
    fillerBreakdown,
    hedgingCount,
    hedgingBreakdown,
    longPauseCount,
    longestPauseMs,
    avgAnswerLengthSec,
    talkToListenRatio,
    iCount,
    weCount,
  };
}
