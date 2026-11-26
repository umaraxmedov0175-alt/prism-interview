import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ShieldAlert, ShieldCheck } from 'lucide-react';
import { COMPANY_GUIDES, PUBLIC_QUESTIONS } from '@/lib/content/catalog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function generateStaticParams() {
  return COMPANY_GUIDES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = COMPANY_GUIDES.find((c) => c.slug === slug);
  if (!company) return { title: 'Company Not Found' };
  return {
    title: `${company.name} Interview Guide`,
    description: company.overview,
  };
}

export default async function CompanyGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = COMPANY_GUIDES.find((c) => c.slug === slug);
  if (!company) notFound();

  return (
    <div className="mx-auto max-w-[960px] space-y-8 px-4 py-12 sm:px-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {company.sourceUrl ? (
            <Badge variant="success">
              <ShieldCheck className="h-3.5 w-3.5" />
              Source verified
            </Badge>
          ) : (
            <Badge variant="warning">
              <ShieldAlert className="h-3.5 w-3.5" />
              unverified
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-semibold text-text">{company.name} Interview Guide</h1>
        <p className="text-text-muted">{company.overview}</p>
        {company.sourceUrl ? (
          <a
            href={company.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            Source: {company.sourceLabel}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <p className="text-xs text-warning">
            Source missing — marked as unverified until an official source URL is attached.
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Typical Interview Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-1.5 pl-4 text-sm text-text-muted">
              {company.stages.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Values & Frameworks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1.5 pl-4 text-sm text-text-muted">
              {company.values.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text">Recommended Practice Questions</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {PUBLIC_QUESTIONS.slice(0, 4).map((q) => (
            <Card key={q.slug}>
              <CardContent className="flex flex-col justify-between gap-3 p-4">
                <p className="text-sm font-medium text-text">{q.text}</p>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/app/drills?questionId=${encodeURIComponent(q.id)}`}>
                    Practice drill
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
