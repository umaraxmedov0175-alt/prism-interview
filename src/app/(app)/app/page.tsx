'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mic, Flame, FileText, ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/states/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listReports, type StoredReport } from '@/lib/storage/local-sessions';

function toDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function computeStreakDays(reports: StoredReport[]): number {
  if (reports.length === 0) return 0;
  const days = new Set(reports.map((r) => toDayKey(new Date(r.createdAt))));
  const cursor = new Date();
  if (!days.has(toDayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(toDayKey(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(toDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export default function DashboardPage() {
  const [reports, setReports] = useState<StoredReport[]>([]);

  useEffect(() => {
    setReports(listReports());
  }, []);

  const recent5 = reports.slice(0, 5);
  const readinessScore =
    recent5.length > 0
      ? Math.round(recent5.reduce((sum, r) => sum + r.report.overallScore, 0) / recent5.length)
      : null;

  const weekAgoMs = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyCount = reports.filter((r) => new Date(r.createdAt).getTime() >= weekAgoMs).length;
  const streakDays = computeStreakDays(reports);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-text">Dashboard</h1>
          <p className="text-sm text-text-muted">
            Your readiness, recent feedback reports, and next recommended practice.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/practice/new">
            Start mock session
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Readiness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-semibold text-text">
              {readinessScore !== null ? `${readinessScore}/100` : '—'}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              {readinessScore !== null
                ? `Based on last ${recent5.length} session${recent5.length === 1 ? '' : 's'}`
                : 'Complete your first mock to unlock'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Weekly Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-semibold text-text">{weeklyCount} / 3</p>
            <p className="mt-1 text-xs text-text-muted">Sessions this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Streak</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-warning" />
            <p className="font-mono text-3xl font-semibold text-text">{streakDays}d</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Recent Reports</h2>
        {reports.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-5 w-5" />}
            title="No sessions completed yet"
            description="Run a 10-minute behavioral or role-specific mock to get your rubric breakdown and top 3 fixes."
            action={
              <Button asChild>
                <Link href="/app/practice/new">
                  <Mic className="h-4 w-4" />
                  Start your first mock
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {recent5.map((r) => (
              <Link key={r.id} href={`/app/reports/${r.id}`} className="block">
                <Card className="transition-colors hover:border-primary/40">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <p className="font-medium text-text">
                        {r.role} · {r.trackSlug} ({r.level})
                      </p>
                      <p className="text-xs text-text-muted">
                        {new Date(r.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-semibold text-text">
                        {r.report.overallScore} / 100
                      </span>
                      <Badge variant={r.report.overallScore >= 70 ? 'success' : 'warning'}>
                        {r.report.hireSignal}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
