import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { LEARN_GUIDES } from '@/lib/content/catalog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function generateStaticParams() {
  return LEARN_GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = LEARN_GUIDES.find((g) => g.slug === slug);
  if (!guide) return { title: 'Guide Not Found' };
  return { title: guide.title, description: guide.summary };
}

export default async function LearnGuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = LEARN_GUIDES.find((g) => g.slug === slug);
  if (!guide) notFound();

  return (
    <div className="mx-auto max-w-[800px] space-y-8 px-4 py-12 sm:px-6">
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" />
        All guides
      </Link>

      <div className="space-y-2">
        <Badge variant="neutral">{guide.readTime}</Badge>
        <h1 className="text-3xl font-semibold text-text">{guide.title}</h1>
        <p className="text-text-muted">{guide.summary}</p>
      </div>

      <div className="space-y-4">
        {guide.sections.map((sec) => (
          <Card key={sec.heading}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{sec.heading}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-muted">{sec.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button size="lg" asChild>
        <Link href={`/app/drills?questionId=${encodeURIComponent(guide.linkedQuestionId)}`}>
          Practice this in a drill
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
