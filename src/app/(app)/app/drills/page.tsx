'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MVP_QUESTIONS } from '@/lib/ai/question-bank';
import type { DrillFeedbackOutput } from '@/lib/ai/schemas/report';
import { getReport } from '@/lib/storage/local-sessions';
import { PageSkeleton } from '@/components/states/PageSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function DrillsContent() {
  const searchParams = useSearchParams();
  const initialQuestionId = searchParams.get('questionId') ?? MVP_QUESTIONS[0].id;
  const reportId = searchParams.get('reportId');

  const [questionId, setQuestionId] = useState(initialQuestionId);
  const [attemptText, setAttemptText] = useState('');
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [result, setResult] = useState<DrillFeedbackOutput | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedQuestion =
    MVP_QUESTIONS.find((q) => q.id === questionId) ?? MVP_QUESTIONS[0];

  useEffect(() => {
    if (!reportId) return;
    const report = getReport(reportId);
    const match = report?.report.perQuestion.find((pq) => pq.questionId === questionId);
    if (match) setPreviousScore(match.score);
  }, [reportId, questionId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!attemptText.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/drills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          questionText: selectedQuestion.text,
          attemptText: attemptText.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Drill grading failed');
      setResult(data.feedback);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to grade drill');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Single-Question Drills</h1>
        <p className="text-sm text-text-muted">
          Practice one targeted question in 2–5 minutes and compare your score side by side.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <select
            aria-label="Drill question"
            value={questionId}
            onChange={(e) => {
              setQuestionId(e.target.value);
              setResult(null);
            }}
            className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
          >
            {MVP_QUESTIONS.map((q) => (
              <option key={q.id} value={q.id}>
                [{q.trackSlug}] {q.text}
              </option>
            ))}
          </select>

          <div className="rounded-[8px] border border-border bg-bg p-4">
            <p className="text-sm font-medium text-text">{selectedQuestion.text}</p>
            <p className="mt-1 text-xs text-text-muted">
              Why interviewers ask this: {selectedQuestion.whyAsked}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              rows={5}
              value={attemptText}
              onChange={(e) => setAttemptText(e.target.value)}
              placeholder="Write your improved answer here using STAR + concrete numbers..."
              className="w-full rounded-[8px] border border-border bg-bg p-3 text-sm text-text"
            />
            {error && (
              <p role="alert" className="text-xs text-danger">
                {error}
              </p>
            )}
            <Button type="submit" disabled={submitting || attemptText.trim().length < 5}>
              {submitting ? 'Grading drill...' : 'Grade my attempt'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <CardTitle className="text-base">Drill Result</CardTitle>
              <div className="flex items-center gap-3">
                {previousScore !== null && (
                  <span className="font-mono text-xs text-text-muted">
                    Previous: {previousScore} / 5 →
                  </span>
                )}
                <Badge variant={result.score >= 4 ? 'success' : result.score === 3 ? 'warning' : 'danger'}>
                  New score: {result.score} / 5
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-success">What improved</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-text-muted">
                  {result.whatImproved.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-warning">Still missing</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-text-muted">
                  {result.stillMissing.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="rounded-[8px] border border-border bg-bg p-3">
              <p className="text-xs font-semibold text-text">Improved structure outline</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-text-muted">
                {result.improvedStructureOutline.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function DrillsPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DrillsContent />
    </Suspense>
  );
}
