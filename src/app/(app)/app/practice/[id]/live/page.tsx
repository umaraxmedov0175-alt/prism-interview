'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { InterviewerOrb } from '@/components/interview/InterviewerOrb';
import { SessionTimer } from '@/components/interview/SessionTimer';
import { TranscriptLine } from '@/components/interview/TranscriptLine';
import { ErrorState } from '@/components/states/ErrorState';
import { PageSkeleton } from '@/components/states/PageSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  getSession,
  saveReport,
  saveSession,
  type StoredSession,
} from '@/lib/storage/local-sessions';

export default function LiveInterviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<StoredSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [turns, setTurns] = useState<
    Array<{ speaker: 'ai' | 'user'; text: string; startMs: number; endMs: number }>
  >([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [ending, setEnding] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [error, setError] = useState('');
  const startTimeRef = useRef<number>(Date.now());
  const turnStartRef = useRef<number>(Date.now());

  useEffect(() => {
    const loaded = getSession(params.id);
    setSession(loaded);
    if (loaded) {
      setTurns(loaded.turns);
      if (loaded.turns.length === 0) {
        void requestAiReply(loaded, []);
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [paused]);

  async function requestAiReply(
    activeSession: StoredSession,
    currentTurns: Array<{ speaker: 'ai' | 'user'; text: string; startMs: number; endMs: number }>
  ) {
    setStreaming(true);
    setError('');
    const aiStartMs = Date.now() - startTimeRef.current;

    try {
      const res = await fetch(`/api/sessions/${activeSession.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackSlug: activeSession.trackSlug,
          level: activeSession.level,
          role: activeSession.role,
          companyName: activeSession.companyName,
          formatSlug: activeSession.formatSlug,
          durationMinutes: activeSession.durationMinutes,
          difficulty: activeSession.difficulty,
          persona: activeSession.persona,
          interviewLanguage: activeSession.interviewLanguage,
          questionPlan: activeSession.questionPlan,
          turns: currentTurns.map((t) => ({ speaker: t.speaker, text: t.text })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Could not reach interviewer');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      setTurns((prev) => [
        ...prev,
        { speaker: 'ai', text: '', startMs: aiStartMs, endMs: aiStartMs + 1000 },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setTurns((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            speaker: 'ai',
            text: fullText.replace('[END_INTERVIEW]', '').trim(),
            startMs: aiStartMs,
            endMs: Date.now() - startTimeRef.current,
          };
          return copy;
        });
      }

      const updatedTurns = [
        ...currentTurns,
        {
          speaker: 'ai' as const,
          text: fullText.replace('[END_INTERVIEW]', '').trim(),
          startMs: aiStartMs,
          endMs: Date.now() - startTimeRef.current,
        },
      ];
      saveSession({ ...activeSession, turns: updatedTurns });
      turnStartRef.current = Date.now();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Streaming failed');
    } finally {
      setStreaming(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !input.trim() || streaming) return;

    const now = Date.now();
    const userTurn = {
      speaker: 'user' as const,
      text: input.trim(),
      startMs: Math.max(0, turnStartRef.current - startTimeRef.current),
      endMs: Math.max(1000, now - startTimeRef.current),
    };

    const nextTurns = [...turns, userTurn];
    setTurns(nextTurns);
    setInput('');
    saveSession({ ...session, turns: nextTurns });
    await requestAiReply(session, nextTurns);
  }

  function handleRepeatQuestion() {
    const lastAi = [...turns].reverse().find((t) => t.speaker === 'ai');
    if (!lastAi || !session) return;
    const repeated = {
      speaker: 'ai' as const,
      text: `Sure, let me repeat that: ${lastAi.text}`,
      startMs: Date.now() - startTimeRef.current,
      endMs: Date.now() - startTimeRef.current + 1000,
    };
    const nextTurns = [...turns, repeated];
    setTurns(nextTurns);
    saveSession({ ...session, turns: nextTurns });
  }

  async function handleEndInterview() {
    if (!session || ending) return;
    setEnding(true);
    setError('');
    try {
      const res = await fetch(`/api/sessions/${session.id}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackSlug: session.trackSlug,
          level: session.level,
          jobDescription: session.jobDescription,
          questionPlan: session.questionPlan,
          turns,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Grading failed');

      saveReport({
        id: data.id,
        sessionId: session.id,
        trackSlug: session.trackSlug,
        level: session.level,
        role: session.role,
        createdAt: data.createdAt,
        modelVersion: data.modelVersion,
        promptVersion: data.promptVersion,
        report: data.report,
        deliveryMetrics: data.deliveryMetrics,
      });

      router.push(`/app/reports/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end interview');
      setEnding(false);
    }
  }

  if (loading) return <PageSkeleton />;
  if (!session) {
    return (
      <ErrorState
        title="Session not found"
        description="Start a new mock interview from the practice setup page."
        onRetry={() => router.push('/app/practice/new')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-[12px] border border-border bg-surface p-4 sm:flex-row sm:items-center">
        <InterviewerOrb speaking={streaming} name={`Alex · ${session.role} (${session.level})`} />
        <SessionTimer
          elapsedSec={elapsedSec}
          paused={paused}
          onTogglePause={() => setPaused((p) => !p)}
          onRepeatQuestion={handleRepeatQuestion}
          onEndInterview={handleEndInterview}
          ending={ending}
        />
      </div>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {turns.map((turn, idx) => (
              <TranscriptLine key={idx} speaker={turn.speaker} text={turn.text} />
            ))}
          </div>

          {error && (
            <p role="alert" className="text-xs text-danger">
              {error}
            </p>
          )}

          <form onSubmit={handleSend} className="flex flex-col gap-3 sm:flex-row">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                paused
                  ? 'Session paused. Click Resume when ready...'
                  : 'Type your answer here (include specific actions and numbers)...'
              }
              disabled={paused || streaming || ending}
              className="flex-1 rounded-[8px] border border-border bg-bg p-3 text-sm text-text placeholder:text-text-muted"
            />
            <Button
              type="submit"
              disabled={paused || streaming || ending || !input.trim()}
              className="sm:self-end"
            >
              <Send className="h-4 w-4" />
              Send answer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
