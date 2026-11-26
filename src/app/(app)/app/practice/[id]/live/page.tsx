'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react';
import { InterviewerOrb } from '@/components/interview/InterviewerOrb';
import { LiveCaption } from '@/components/interview/LiveCaption';
import { RecordingBadge } from '@/components/interview/RecordingBadge';
import { SessionTimer } from '@/components/interview/SessionTimer';
import { TranscriptLine } from '@/components/interview/TranscriptLine';
import { CaseRoom } from '@/components/rooms/CaseRoom';
import { CodingRoom } from '@/components/rooms/CodingRoom';
import { WhiteboardRoom } from '@/components/rooms/WhiteboardRoom';
import { ErrorState } from '@/components/states/ErrorState';
import { PageSkeleton } from '@/components/states/PageSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  getSession,
  saveReport,
  saveSession,
  type StoredSession,
} from '@/lib/storage/local-sessions';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

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
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [ending, setEnding] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [captionsVisible, setCaptionsVisible] = useState(true);
  const [voiceMode, setVoiceMode] = useState<'gemini-live' | 'browser-speech'>('browser-speech');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState('');

  const startTimeRef = useRef<number>(Date.now());
  const turnStartRef = useRef<number>(Date.now());
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const loaded = getSession(params.id);
    setSession(loaded);

    fetch('/api/live/token', { method: 'POST' })
      .then((r) => r.json())
      .then((d) => {
        if (d.mode === 'gemini-live') setVoiceMode('gemini-live');
      })
      .catch(() => {
        // Stay in browser-speech fallback
      });

    if (loaded) {
      setTurns(loaded.turns);
      if (loaded.turns.length === 0) {
        void requestAiReply(loaded, []);
      }
    }
    setLoading(false);

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      recognitionRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [paused]);

  function speakText(text: string) {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.02;
    utterance.onstart = () => setAiSpeaking(true);
    utterance.onend = () => setAiSpeaking(false);
    utterance.onerror = () => setAiSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function interruptAiSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setAiSpeaking(false);
  }

  function toggleMic() {
    if (micActive) {
      recognitionRef.current?.stop();
      setMicActive(false);
      setRecording(false);
      return;
    }

    interruptAiSpeech();
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechRec = win.SpeechRecognition ?? win.webkitSpeechRecognition;

    if (!SpeechRec) {
      setError('Voice recognition is not supported in this browser. Use text input below.');
      return;
    }

    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = session?.interviewLanguage || 'en-US';

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      interruptAiSpeech(); // Barge-in when user starts speaking
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + ' ';
      }
      setInput(transcript.trim());
    };

    recognition.onerror = () => {
      setMicActive(false);
      setRecording(false);
    };

    recognition.onend = () => {
      setMicActive(false);
      setRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setMicActive(true);
    setRecording(true);
    turnStartRef.current = Date.now();
  }

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

      const cleanText = fullText.replace('[END_INTERVIEW]', '').trim();
      const updatedTurns = [
        ...currentTurns,
        {
          speaker: 'ai' as const,
          text: cleanText,
          startMs: aiStartMs,
          endMs: Date.now() - startTimeRef.current,
        },
      ];
      saveSession({ ...activeSession, turns: updatedTurns });
      turnStartRef.current = Date.now();
      speakText(cleanText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Streaming failed');
    } finally {
      setStreaming(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !input.trim() || streaming) return;

    if (micActive) {
      recognitionRef.current?.stop();
      setMicActive(false);
      setRecording(false);
    }

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
    const text = `Sure, let me repeat that: ${lastAi.text}`;
    const repeated = {
      speaker: 'ai' as const,
      text,
      startMs: Date.now() - startTimeRef.current,
      endMs: Date.now() - startTimeRef.current + 1000,
    };
    const nextTurns = [...turns, repeated];
    setTurns(nextTurns);
    saveSession({ ...session, turns: nextTurns });
    speakText(text);
  }

  async function handleEndInterview() {
    if (!session || ending) return;
    interruptAiSpeech();
    recognitionRef.current?.stop();
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

  const latestTurn = turns[turns.length - 1];
  const hasWorkspaceRoom =
    session.trackSlug === 'software-engineering' ||
    session.trackSlug === 'system-design' ||
    session.trackSlug === 'consulting';

  const chatTranscriptSection = (
    <div className="space-y-5">
      <LiveCaption
        speaker={latestTurn?.speaker ?? null}
        text={latestTurn?.text ?? ''}
        visible={captionsVisible}
        onToggle={() => setCaptionsVisible((v) => !v)}
      />

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="max-h-[380px] space-y-3 overflow-y-auto pr-1">
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
            <div className="flex gap-2 sm:self-end">
              <Button
                type="button"
                variant={micActive ? 'danger' : 'outline'}
                onClick={toggleMic}
                aria-label={micActive ? 'Stop microphone' : 'Start microphone'}
                disabled={paused || ending}
              >
                {micActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {micActive ? 'Listening' : 'Speak'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  if (ttsEnabled) interruptAiSpeech();
                  setTtsEnabled((t) => !t);
                }}
                aria-label={ttsEnabled ? 'Mute interviewer voice' : 'Unmute interviewer voice'}
              >
                {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>
            <textarea
              rows={2}
              value={input}
              onChange={(e) => {
                interruptAiSpeech();
                setInput(e.target.value);
              }}
              placeholder={
                paused
                  ? 'Session paused. Click Resume when ready...'
                  : 'Speak with the mic or type your answer here...'
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

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-[12px] border border-border bg-surface p-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <InterviewerOrb
            speaking={streaming || aiSpeaking}
            name={`Alex · ${session.role} (${session.level})`}
          />
          <Badge variant="neutral">
            {voiceMode === 'gemini-live' ? 'Gemini Live' : 'Voice + Text'}
          </Badge>
          {session.formatSlug === 'panel' && (
            <Badge variant="primary">Panel (3 Interviewers)</Badge>
          )}
          {session.formatSlug === 'one-way-recorded' && (
            <Badge variant="warning">One-way Recorded (30s prep / 2m answer)</Badge>
          )}
          <RecordingBadge recording={recording} />
        </div>

        <SessionTimer
          elapsedSec={elapsedSec}
          paused={paused}
          onTogglePause={() => setPaused((p) => !p)}
          onRepeatQuestion={handleRepeatQuestion}
          onEndInterview={handleEndInterview}
          ending={ending}
        />
      </div>

      {hasWorkspaceRoom ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-5">{chatTranscriptSection}</div>
          <div className="lg:col-span-7">
            {session.trackSlug === 'software-engineering' && (
              <CodingRoom
                onSnapshot={(code, testSummary, hintsUsed) => {
                  const snapshot = `[Code Snapshot | ${testSummary} | Hints: ${hintsUsed}]\n${code}`;
                  setInput((prev) => (prev ? `${prev}\n\n${snapshot}` : snapshot));
                }}
              />
            )}
            {session.trackSlug === 'system-design' && (
              <WhiteboardRoom
                onSnapshot={(summaryText, currentPhase) => {
                  const snapshot = `[Whiteboard Phase: ${currentPhase}]\n${summaryText}`;
                  setInput((prev) => (prev ? `${prev}\n\n${snapshot}` : snapshot));
                }}
              />
            )}
            {session.trackSlug === 'consulting' && (
              <CaseRoom
                onSnapshot={(scratchpadText, revealedCount) => {
                  const snapshot = `[Case Scratchpad | Exhibits revealed: ${revealedCount}]\n${scratchpadText}`;
                  setInput((prev) => (prev ? `${prev}\n\n${snapshot}` : snapshot));
                }}
              />
            )}
          </div>
        </div>
      ) : (
        chatTranscriptSection
      )}
    </div>
  );
}
