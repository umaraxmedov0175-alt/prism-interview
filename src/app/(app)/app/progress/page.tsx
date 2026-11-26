'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { MetricTile } from '@/components/interview/MetricTile';
import { EmptyState } from '@/components/states/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { listReports, type StoredReport } from '@/lib/storage/local-sessions';

export default function ProgressPage() {
  const [reports, setReports] = useState<StoredReport[]>([]);

  useEffect(() => {
    setReports(listReports());
  }, []);

  const recent5 = reports.slice(0, 5);
  const avgScore =
    recent5.length > 0
      ? Math.round(recent5.reduce((s, r) => s + r.report.overallScore, 0) / recent5.length)
      : 0;
  const avgWpm =
    recent5.length > 0
      ? Math.round(
          recent5.reduce((s, r) => s + r.deliveryMetrics.wordsPerMinute, 0) / recent5.length
        )
      : 0;
  const avgFiller =
    recent5.length > 0
      ? (
          recent5.reduce((s, r) => s + r.deliveryMetrics.fillerPercentage, 0) / recent5.length
        ).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text">Progress Dashboard</h1>
        <p className="text-sm text-text-muted">
          Readiness score, delivery trends, and your session history.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <MetricTile label="Readiness (last 5)" value={recent5.length ? `${avgScore}/100` : '—'} />
        <MetricTile label="Avg Pace" value={recent5.length ? `${avgWpm} WPM` : '—'} target="130–160" />
        <MetricTile label="Avg Fillers" value={recent5.length ? `${avgFiller}%` : '—'} target="< 3%" />
        <MetricTile label="Total Sessions" value={reports.length} target="3 / week" />
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={<BarChart3 className="h-5 w-5" />}
          title="No progress data yet"
          description="Complete at least one mock interview to see readiness trends and weakest competencies."
          action={
            <Button asChild>
              <Link href="/app/practice/new">Start mock session</Link>
            </Button>
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Session History</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-text-muted">
                  <th className="py-2 pr-4">Role / Track</th>
                  <th className="py-2 pr-4">Level</th>
                  <th className="py-2 pr-4">Score</th>
                  <th className="py-2 pr-4">Signal</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-border/60">
                    <td className="py-2.5 pr-4">
                      <Link href={`/app/reports/${r.id}`} className="font-medium text-primary hover:underline">
                        {r.role} · {r.trackSlug}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4 text-text-muted">{r.level}</td>
                    <td className="py-2.5 pr-4 font-mono">{r.report.overallScore}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={r.report.overallScore >= 70 ? 'success' : 'warning'}>
                        {r.report.hireSignal}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-xs text-text-muted">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
