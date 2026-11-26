'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Mic } from 'lucide-react';
import { EmptyState } from '@/components/states/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { listReports, type StoredReport } from '@/lib/storage/local-sessions';

export default function ReportsListPage() {
  const [reports, setReports] = useState<StoredReport[]>([]);

  useEffect(() => {
    setReports(listReports());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text">Feedback Reports</h1>
          <p className="text-sm text-text-muted">
            Review rubric scores, transcript quotes, and top fixes from your sessions.
          </p>
        </div>
        <Button asChild>
          <Link href="/app/practice/new">New mock</Link>
        </Button>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="No reports yet"
          description="Complete a mock interview to generate your first rubric and delivery report."
          action={
            <Button asChild>
              <Link href="/app/practice/new">
                <Mic className="h-4 w-4" />
                Start mock session
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
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
  );
}
