'use client';

import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getSavedPlan,
  savePlan,
  type InterviewPlanDay,
  type StoredPlan,
} from '@/lib/storage/local-sessions';

function generateDays(interviewDate: string, hoursPerDay: number): InterviewPlanDay[] {
  const target = new Date(interviewDate);
  const today = new Date();
  const diffDays = Math.max(
    1,
    Math.min(14, Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
  );

  const focuses = [
    'Story Bank & STAR structure',
    'Behavioral mock (10 min) + top 3 fixes',
    'Role & technical fundamentals drill',
    'Full 20-min realistic mock + delivery review',
    'Weakest competency drills & company questions',
  ];

  return Array.from({ length: diffDays }, (_, i) => {
    const d = new Date(today.getTime() + i * 86400000);
    return {
      day: i + 1,
      date: d.toLocaleDateString(),
      focus: focuses[i % focuses.length],
      tasks: [
        `${Math.max(1, Math.round(hoursPerDay * 30))} min: Targeted question drill`,
        `${Math.max(1, Math.round(hoursPerDay * 30))} min: Review rubric & refine STAR metrics`,
      ],
    };
  });
}

export default function InterviewPlanPage() {
  const [plan, setPlan] = useState<StoredPlan | null>(null);
  const [jd, setJd] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState(1);

  useEffect(() => {
    const existing = getSavedPlan();
    if (existing) {
      setPlan(existing);
      setJd(existing.jobDescription);
      setDate(existing.interviewDate);
      setHours(existing.hoursPerDay);
    }
  }, []);

  function handleBuild(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    const next: StoredPlan = {
      jobDescription: jd,
      interviewDate: date,
      hoursPerDay: hours,
      days: generateDays(date, hours),
      updatedAt: new Date().toISOString(),
    };
    savePlan(next);
    setPlan(next);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text">Interview Plan</h1>
        <p className="text-sm text-text-muted">
          Paste your job description and interview date to generate a day-by-day prep schedule.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Target Interview Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBuild} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="planDate" className="block text-xs font-medium text-text">
                  Interview Date
                </label>
                <input
                  id="planDate"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="hours" className="block text-xs font-medium text-text">
                  Hours per day
                </label>
                <input
                  id="hours"
                  type="number"
                  min={0.5}
                  max={8}
                  step={0.5}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
                />
              </div>
            </div>
            <textarea
              rows={3}
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste job description..."
              className="w-full rounded-[8px] border border-border bg-bg p-3 text-sm text-text"
            />
            <Button type="submit">
              <Calendar className="h-4 w-4" />
              Generate / Recalculate Plan
            </Button>
          </form>
        </CardContent>
      </Card>

      {plan && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-text">Your Day-by-Day Schedule</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {plan.days.map((d) => (
              <Card key={d.day}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Day {d.day} ({d.date}) — {d.focus}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc space-y-1 pl-4 text-xs text-text-muted">
                    {d.tasks.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
