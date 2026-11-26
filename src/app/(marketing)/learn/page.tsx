import Link from 'next/link';
import { LEARN_GUIDES } from '@/lib/content/catalog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Learn Hub',
  description: 'Short, practical interview guides with linked practice drills.',
};

export default function LearnHubPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-semibold text-text">Learn Hub</h1>
        <p className="text-text-muted">
          Concise frameworks you can immediately test in a 2–5 minute practice drill.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {LEARN_GUIDES.map((guide) => (
          <Link key={guide.slug} href={`/learn/${guide.slug}`} className="block">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader>
                <Badge variant="neutral" className="w-fit">
                  {guide.readTime}
                </Badge>
                <CardTitle className="pt-2 text-lg">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted">{guide.summary}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
