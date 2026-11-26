import { COMPANY_GUIDES, PUBLIC_QUESTIONS } from '@/lib/content/catalog';
import { MVP_TRACKS } from '@/lib/ai/question-bank';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Admin',
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Content Admin</h1>
        <p className="text-sm text-text-muted">
          Overview of tracks, rubrics, questions, and company source verification.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-text-muted">MVP Tracks & Rubrics</CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-2xl font-semibold">
            {MVP_TRACKS.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-text-muted">Active Questions</CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-2xl font-semibold">
            {PUBLIC_QUESTIONS.length}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-text-muted">Company Guides</CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-2xl font-semibold">
            {COMPANY_GUIDES.length}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Source Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {COMPANY_GUIDES.map((c) => (
            <div
              key={c.slug}
              className="flex items-center justify-between rounded-[8px] border border-border bg-bg p-3 text-sm"
            >
              <span className="font-medium text-text">{c.name}</span>
              <Badge variant={c.sourceUrl ? 'success' : 'warning'}>
                {c.sourceUrl ? 'Verified' : 'unverified'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
