'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Search } from 'lucide-react';
import { PUBLIC_QUESTIONS } from '@/lib/content/catalog';
import { getSavedQuestionIds, toggleSavedQuestionId } from '@/lib/storage/local-sessions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AppQuestionsPage() {
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState('all');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(getSavedQuestionIds());
  }, []);

  const filtered = PUBLIC_QUESTIONS.filter((q) => {
    const matchesTrack = track === 'all' || q.trackSlug === track;
    const matchesQuery =
      !query.trim() || q.text.toLowerCase().includes(query.toLowerCase());
    return matchesTrack && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Question Bank</h1>
        <p className="text-sm text-text-muted">
          Filter questions, save to your practice list, or launch a 2–5 min drill.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            className="h-10 w-full rounded-[8px] border border-border bg-bg pl-9 pr-3 text-sm text-text"
          />
        </div>
        <select
          aria-label="Filter by track"
          value={track}
          onChange={(e) => setTrack(e.target.value)}
          className="h-10 rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
        >
          <option value="all">All tracks</option>
          <option value="behavioral">Behavioral</option>
          <option value="general-hr">General / HR</option>
          <option value="software-engineering">Software Engineering</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((q) => {
          const isSaved = savedIds.includes(q.id);
          return (
            <Card key={q.id}>
              <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <Badge variant="neutral">{q.trackSlug}</Badge>
                    <Badge variant="primary">{q.difficulty}</Badge>
                  </div>
                  <p className="text-sm font-medium text-text">{q.text}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={isSaved ? 'primary' : 'outline'}
                    onClick={() => setSavedIds(toggleSavedQuestionId(q.id))}
                    aria-label={isSaved ? 'Remove from saved' : 'Save question'}
                  >
                    <Bookmark className="h-3.5 w-3.5" />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/app/drills?questionId=${encodeURIComponent(q.id)}`}>
                      Drill
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
