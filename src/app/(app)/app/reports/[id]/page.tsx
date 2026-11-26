'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Printer, Target } from 'lucide-react';
import { MetricTile } from '@/components/interview/MetricTile';
import { ReplayPlayer } from '@/components/interview/ReplayPlayer';
import { RubricBar } from '@/components/interview/RubricBar';
import { ScoreRing } from '@/components/interview/ScoreRing';
import { ErrorState } from '@/components/states/ErrorState';
import { PageSkeleton } from '@/components/states/PageSkeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getReport, getSession, type StoredReport, type StoredSession } from '@/lib/storage/local-sessions';

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<StoredReport | null>(null);
  const [session, setSession] = useState<StoredSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedReport = getReport(params.id);
    setData(loadedReport);
    if (loadedReport) {
      setSession(getSession(loadedReport.sessionId));
    }
    setLoading(false);
  }, [params.id]);

  if (loading) return <PageSkeleton />;
  if (!data) {
    return (
      <ErrorState
        title="Report not found"
        description="This report could not be found in your local session history."
        onRetry={() => router.push('/app/reports')}
      />
    );
  }

  const { report, deliveryMetrics } = data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs text-text-muted">
            {data.trackSlug} · {data.level} · Model: {data.modelVersion}
          </p>
          <h1 className="text-2xl font-semibold text-text">Interview Feedback Report</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" asChild>
            <Link href="/app/practice/new">Run another mock</Link>
          </Button>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardContent className="grid gap-6 p-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <ScoreRing score={report.overallScore} hireSignal={report.hireSignal} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-8">
            <MetricTile label="Words / min" value={deliveryMetrics.wordsPerMinute} target="130–160" />
            <MetricTile
              label="Filler words"
              value={`${deliveryMetrics.fillerPercentage}%`}
              target="< 3%"
            />
            <MetricTile
              label="Avg answer"
              value={`${deliveryMetrics.avgAnswerLengthSec}s`}
              target="90–150s"
            />
            <MetricTile
              label="I vs We"
              value={`${deliveryMetrics.iCount} / ${deliveryMetrics.weCount}`}
              target="Clear ownership"
            />
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Fixes */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Top Fixes Ranked by Impact</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {report.topFixes.map((fix) => (
            <Card key={fix.rank}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="primary">Fix #{fix.rank}</Badge>
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="pt-2 text-base">{fix.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-text-muted">{fix.reason}</p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link
                    href={`/app/drills?questionId=${encodeURIComponent(fix.questionId)}&reportId=${encodeURIComponent(data.id)}`}
                  >
                    Retry with this fix
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Rubric Breakdown */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Rubric Breakdown</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {report.rubricScores.map((r) => (
            <RubricBar
              key={r.dimension}
              dimension={r.dimension}
              weight={r.weight}
              score={r.score}
              evidenceQuote={r.evidenceQuote}
            />
          ))}
        </div>
      </div>

      {/* Per-question Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text">Per-Question Breakdown</h2>
        {report.perQuestion.map((pq, idx) => (
          <Card key={pq.questionId + idx}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-base">{pq.questionText}</CardTitle>
                <Badge variant={pq.score >= 4 ? 'success' : pq.score === 3 ? 'warning' : 'danger'}>
                  {pq.score} / 5
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-[8px] border border-border bg-bg p-3">
                <p className="text-xs font-medium text-text-muted">Your transcript</p>
                <p className="mt-1 text-text">{pq.userTranscript}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-success">What worked</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-text-muted">
                    {pq.whatWorked.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-warning">What was missing</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4 text-xs text-text-muted">
                    {pq.whatWasMissing.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="rounded-[8px] border border-border bg-bg p-3">
                <p className="text-xs font-semibold text-text">
                  Improved structure outline (using only your facts)
                </p>
                <ul className="mt-1.5 list-disc space-y-1 pl-4 text-xs text-text-muted">
                  {pq.improvedStructureOutline.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Synced Transcript Replay */}
      {session && session.turns.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-text">Transcript & Filler-Word Replay</h2>
          <ReplayPlayer turns={session.turns} />
        </div>
      )}
    </div>
  );
}
