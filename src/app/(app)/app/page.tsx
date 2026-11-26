import Link from 'next/link';
import { Mic, Flame, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/states/EmptyState';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
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
            <p className="font-mono text-3xl font-semibold text-text">—</p>
            <p className="mt-1 text-xs text-text-muted">Complete your first mock to unlock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Weekly Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl font-semibold text-text">0 / 3</p>
            <p className="mt-1 text-xs text-text-muted">Sessions this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-muted">Streak</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-warning" />
            <p className="font-mono text-3xl font-semibold text-text">0d</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Recent Reports</h2>
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
      </div>
    </div>
  );
}
