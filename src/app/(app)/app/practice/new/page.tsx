'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { MVP_TRACKS } from '@/lib/ai/question-bank';
import { saveSession } from '@/lib/storage/local-sessions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewPracticePage() {
  const router = useRouter();
  const [trackSlug, setTrackSlug] = useState('behavioral');
  const [level, setLevel] = useState('mid');
  const [role, setRole] = useState('Software Engineer');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [difficulty, setDifficulty] = useState<'warm-up' | 'realistic' | 'tough'>('realistic');
  const [persona, setPersona] = useState<'friendly' | 'neutral' | 'skeptical'>('neutral');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackSlug,
          formatSlug: 'one-on-one-video',
          level,
          role,
          companyName: companyName || undefined,
          jobDescription: jobDescription || undefined,
          durationMinutes,
          difficulty,
          persona,
          interviewLanguage: 'en',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create session');

      saveSession({
        ...data,
        turns: [],
      });

      router.push(`/app/practice/${data.id}/check`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">New Mock Interview</h1>
        <p className="text-sm text-text-muted">
          Configure your track, seniority, and persona. Your session starts immediately.
        </p>
      </div>

      <form onSubmit={handleStart}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Session Setup</CardTitle>
            <CardDescription>
              Every session builds a tailored question plan and grades against a published rubric.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="track" className="block text-xs font-medium text-text">
                Track
              </label>
              <select
                id="track"
                value={trackSlug}
                onChange={(e) => setTrackSlug(e.target.value)}
                className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
              >
                {MVP_TRACKS.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="role" className="block text-xs font-medium text-text">
                  Target Role
                </label>
                <input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="level" className="block text-xs font-medium text-text">
                  Seniority Level
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
                >
                  <option value="intern">Intern</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-level</option>
                  <option value="senior">Senior</option>
                  <option value="staff_lead">Staff / Lead</option>
                  <option value="manager">Manager</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="duration" className="block text-xs font-medium text-text">
                  Length
                </label>
                <select
                  id="duration"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
                >
                  <option value={10}>10 min (3 questions)</option>
                  <option value={20}>20 min (4 questions)</option>
                  <option value={30}>30 min (5 questions)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="difficulty" className="block text-xs font-medium text-text">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as 'warm-up' | 'realistic' | 'tough')
                  }
                  className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
                >
                  <option value="warm-up">Warm-up</option>
                  <option value="realistic">Realistic</option>
                  <option value="tough">Tough</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="persona" className="block text-xs font-medium text-text">
                  Persona
                </label>
                <select
                  id="persona"
                  value={persona}
                  onChange={(e) =>
                    setPersona(e.target.value as 'friendly' | 'neutral' | 'skeptical')
                  }
                  className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
                >
                  <option value="friendly">Friendly</option>
                  <option value="neutral">Neutral</option>
                  <option value="skeptical">Skeptical</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="company" className="block text-xs font-medium text-text">
                Target Company (optional)
              </label>
              <input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, Linear"
                className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="jd" className="block text-xs font-medium text-text">
                Job Description (optional)
              </label>
              <textarea
                id="jd"
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key responsibilities to tailor questions and keyword matching..."
                className="w-full rounded-[8px] border border-border bg-bg p-3 text-sm text-text"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs text-danger">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Building question plan...' : 'Start interview room'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
