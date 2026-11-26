'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { CompetencyGrid } from '@/components/interview/CompetencyGrid';
import { EmptyState } from '@/components/states/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COMPETENCY_LIST } from '@/lib/content/catalog';
import {
  deleteStory,
  listStories,
  saveStory,
  type StoredStory,
} from '@/lib/storage/local-sessions';

export default function StoriesPage() {
  const [stories, setStories] = useState<StoredStory[]>([]);
  const [title, setTitle] = useState('');
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const [learning, setLearning] = useState('');
  const [metrics, setMetrics] = useState('');
  const [selectedComps, setSelectedComps] = useState<string[]>(['ownership']);

  useEffect(() => {
    setStories(listStories());
  }, []);

  function toggleComp(slug: string) {
    setSelectedComps((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const story: StoredStory = {
      id: crypto.randomUUID(),
      title: title.trim(),
      situation: situation.trim(),
      task: task.trim(),
      action: action.trim(),
      result: result.trim(),
      learning: learning.trim(),
      metrics: metrics.trim(),
      competencies: selectedComps,
      createdAt: new Date().toISOString(),
    };
    saveStory(story);
    setStories(listStories());
    setTitle('');
    setSituation('');
    setTask('');
    setAction('');
    setResult('');
    setLearning('');
    setMetrics('');
  }

  const coveredSlugs = stories.flatMap((s) => s.competencies);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text">Story Bank (STAR Builder)</h1>
        <p className="text-sm text-text-muted">
          Store your real experiences once and map them to competencies. Never invent stories.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-semibold text-text">Competency Coverage Grid</h2>
        <CompetencyGrid coveredSlugs={coveredSlugs} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add a Real Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Story title (e.g. Checkout DB latency fix)"
                className="h-10 rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
              />
              <input
                value={metrics}
                onChange={(e) => setMetrics(e.target.value)}
                placeholder="Key metrics (e.g. p95 420ms -> 115ms)"
                className="h-10 rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <textarea
                rows={2}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="Situation: context & stakes"
                className="rounded-[8px] border border-border bg-bg p-3 text-sm text-text"
              />
              <textarea
                rows={2}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Task: your specific responsibility"
                className="rounded-[8px] border border-border bg-bg p-3 text-sm text-text"
              />
              <textarea
                rows={2}
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="Action: what YOU personally did"
                className="rounded-[8px] border border-border bg-bg p-3 text-sm text-text"
              />
              <textarea
                rows={2}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Result & Learning: measured outcome + takeaway"
                className="rounded-[8px] border border-border bg-bg p-3 text-sm text-text"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-text">Competencies proven</p>
              <div className="flex flex-wrap gap-2">
                {COMPETENCY_LIST.map((c) => {
                  const active = selectedComps.includes(c.slug);
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => toggleComp(c.slug)}
                      className={`rounded-[999px] border px-3 py-1 text-xs transition-colors ${
                        active
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border bg-bg text-text-muted'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button type="submit">
              <Plus className="h-4 w-4" />
              Save story
            </Button>
          </form>
        </CardContent>
      </Card>

      {stories.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-5 w-5" />}
          title="No stories saved yet"
          description="Add 3–5 real stories above to fill your competency coverage grid."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {stories.map((s) => (
            <Card key={s.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{s.title}</CardTitle>
                  <button
                    type="button"
                    aria-label={`Delete ${s.title}`}
                    onClick={() => {
                      deleteStory(s.id);
                      setStories(listStories());
                    }}
                    className="text-text-muted hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-text-muted">
                {s.metrics && <p className="font-mono text-success">Metrics: {s.metrics}</p>}
                {s.action && <p>Action: {s.action}</p>}
                {s.result && <p>Result: {s.result}</p>}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {s.competencies.map((c) => (
                    <Badge key={c} variant="neutral">
                      {c}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
