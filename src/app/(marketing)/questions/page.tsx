import Link from 'next/link';
import { PUBLIC_QUESTIONS } from '@/lib/content/catalog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Interview Question Bank',
  description:
    'Browse behavioral, HR, and software engineering interview questions with rubrics and practice drills.',
};

export default function PublicQuestionsPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-12 sm:px-6">
      <div className="max-w-2xl space-y-2">
        <h1 className="text-3xl font-semibold text-text">Interview Question Bank</h1>
        <p className="text-text-muted">
          Every question includes why interviewers ask it, what a strong answer covers, and a
          2–5 minute practice drill.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {PUBLIC_QUESTIONS.map((q) => (
          <Link key={q.slug} href={`/questions/${q.slug}`} className="block">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="neutral">{q.trackSlug}</Badge>
                  <Badge variant="primary">{q.difficulty}</Badge>
                </div>
                <CardTitle className="pt-2 text-base">{q.text}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-text-muted">{q.whyAsked}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
