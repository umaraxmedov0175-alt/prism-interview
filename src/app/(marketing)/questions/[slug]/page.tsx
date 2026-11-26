import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PUBLIC_QUESTIONS } from '@/lib/content/catalog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function generateStaticParams() {
  return PUBLIC_QUESTIONS.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const q = PUBLIC_QUESTIONS.find((item) => item.slug === slug);
  if (!q) return { title: 'Question Not Found' };
  return {
    title: q.text,
    description: q.whyAsked,
  };
}

export default async function PublicQuestionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const q = PUBLIC_QUESTIONS.find((item) => item.slug === slug);
  if (!q) notFound();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: q.text,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${q.whyAsked} Strong answers cover: ${q.strongAnswerPoints.join('; ')}.`,
        },
      },
    ],
  };

  return (
    <div className="mx-auto max-w-[880px] space-y-6 px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Link
        href="/questions"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" />
        All questions
      </Link>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">{q.trackSlug}</Badge>
          <Badge variant="neutral">{q.category}</Badge>
          <Badge variant="primary">{q.difficulty}</Badge>
        </div>
        <h1 className="text-2xl font-semibold text-text sm:text-3xl">{q.text}</h1>
        <p className="text-text-muted">{q.whyAsked}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-success">What a strong answer covers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-4 text-sm text-text-muted">
              {q.strongAnswerPoints.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-warning">Common mistakes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-4 text-sm text-text-muted">
              {q.commonMistakes.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Button size="lg" asChild>
        <Link href={`/app/drills?questionId=${encodeURIComponent(q.id)}`}>
          Practice this question (2–5 min drill)
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
