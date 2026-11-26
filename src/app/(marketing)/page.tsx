import Link from 'next/link';
import { ArrowRight, Check, Mic, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TRACKS = [
  {
    name: 'Behavioral / Competency',
    desc: 'STAR structure, ownership, conflict, failure, and leadership.',
    tool: 'STAR checker',
  },
  {
    name: 'General / HR Screen',
    desc: 'Tell me about yourself, motivation, strengths, weaknesses, and role fit.',
    tool: 'Rubric grading',
  },
  {
    name: 'Software Engineering',
    desc: 'Data structures, algorithms, debugging, complexity, and code quality.',
    tool: 'Code editor',
  },
  {
    name: 'System Design',
    desc: 'Requirements, estimates, API, data model, scaling, and trade-offs.',
    tool: 'Whiteboard',
  },
  {
    name: 'Product Management',
    desc: 'Product sense, metrics, prioritization, execution, and strategy.',
    tool: 'Whiteboard',
  },
  {
    name: 'Consulting & Case',
    desc: 'Market sizing, profitability, M&A, exhibits, and case math.',
    tool: 'Scratchpad',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Pick your exact interview',
    desc: 'Choose track, seniority level, format, and paste a job description if you have one.',
  },
  {
    step: '02',
    title: 'Answer realistic follow-ups',
    desc: 'The AI interviewer listens, pushes back on vague claims, and asks for your specific role.',
  },
  {
    step: '03',
    title: 'Fix what actually matters',
    desc: 'Get rubric scores with transcript quotes, delivery metrics, and targeted single-question drills.',
  },
];

const FAQS = [
  {
    q: 'Does Prism: Interview work as a live-interview copilot?',
    a: 'No. We never build stealth overlays or live-interview answer helpers. Prism: Interview is strictly for honest practice before your interview.',
  },
  {
    q: 'Does the AI write full scripted answers for me to memorize?',
    a: 'No. The grader builds improved bulleted structure outlines using only the facts you stated, and marks missing details for you to fill in.',
  },
  {
    q: 'How are delivery metrics computed?',
    a: 'Words per minute, filler words, hedging phrases, pauses, and talk ratio are computed deterministically in code from your transcript—never guessed by the model, and we never score accent.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 lg:col-span-7">
            <Badge variant="primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Practice-only. No live-interview copilot.
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
              Practice the exact interview you are about to face.
            </h1>
            <p className="max-w-xl text-base text-text-muted sm:text-lg">
              An AI interviewer that listens, asks adaptive follow-ups when your answer is vague,
              and grades every response against a published rubric.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/auth/login">
                  Start free mock
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/#sample-report">See sample report</Link>
              </Button>
            </div>
            <p className="text-xs text-text-muted">
              Free tier includes 3 mock sessions/month, question bank access, and rubric feedback.
            </p>
          </div>

          {/* Live session preview card */}
          <div className="lg:col-span-5">
            <Card className="overflow-hidden border-border bg-surface">
              <CardHeader className="border-b border-border bg-bg/60 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
                    <span className="text-xs font-medium text-text">
                      Behavioral · Senior · Neutral Persona
                    </span>
                  </div>
                  <span className="font-mono text-xs text-text-muted">08:42</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                <div className="space-y-1.5 rounded-[8px] border border-border bg-bg p-3.5">
                  <p className="text-xs font-medium text-primary">Interviewer</p>
                  <p className="text-sm text-text">
                    You mentioned the migration cut latency. What was your specific individual role,
                    and what numbers changed?
                  </p>
                </div>
                <div className="space-y-1.5 rounded-[8px] border border-border bg-bg p-3.5">
                  <p className="text-xs font-medium text-text-muted">Your answer (transcript)</p>
                  <p className="text-sm text-text-muted">
                    I led the query-plan rewrite for the checkout service, reducing p95 latency from
                    420 ms to 115 ms over three weeks.
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-[8px] border border-border bg-bg px-3.5 py-2.5 text-xs">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <Mic className="h-3.5 w-3.5 text-primary" />
                    Adaptive follow-up · 1 of 2
                  </span>
                  <span className="font-mono text-success">Specificity: 5/5</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 max-w-2xl space-y-2">
            <h2 className="text-2xl font-semibold text-text sm:text-3xl">How it works</h2>
            <p className="text-text-muted">
              Go from landing page to your first graded mock session in under three minutes.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((item) => (
              <Card key={item.step}>
                <CardHeader>
                  <span className="font-mono text-xs font-medium text-primary">{item.step}</span>
                  <CardTitle className="mt-1 text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-muted">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Track grid */}
      <section id="tracks" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl font-semibold text-text sm:text-3xl">
                Built for every interview round
              </h2>
              <p className="text-text-muted">
                Every session pairs a track (what is tested) with a format (how it runs).
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/auth/login">Explore tracks in app</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((track) => (
              <Card key={track.name} className="transition-colors hover:border-primary/40">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{track.name}</CardTitle>
                    <Badge variant="neutral">{track.tool}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-muted">{track.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section id="sample-report" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 max-w-2xl space-y-2">
            <Badge variant="neutral">Sample Report</Badge>
            <h2 className="text-2xl font-semibold text-text sm:text-3xl">
              Content, delivery, and technicals in one debrief
            </h2>
            <p className="text-text-muted">
              Every score is backed by a quoted line from your transcript and a drill to fix it.
            </p>
          </div>

          <Card>
            <CardContent className="grid gap-8 p-6 lg:grid-cols-12">
              <div className="space-y-4 lg:col-span-4">
                <div className="rounded-[8px] border border-border bg-bg p-4">
                  <p className="text-xs text-text-muted">Overall Score</p>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-mono text-4xl font-semibold text-text">78</span>
                    <span className="text-sm text-text-muted">/ 100</span>
                    <Badge variant="success">Lean yes</Badge>
                  </div>
                </div>
                <div className="rounded-[8px] border border-border bg-bg p-4 space-y-2">
                  <p className="text-xs font-medium text-text">Delivery Metrics (computed)</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Pace</span>
                    <span className="font-mono text-text">144 WPM</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Filler words</span>
                    <span className="font-mono text-success">1.8%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Avg answer length</span>
                    <span className="font-mono text-text">118 s</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 lg:col-span-8">
                <p className="text-sm font-semibold text-text">Rubric Breakdown (1–5 scale)</p>
                <div className="space-y-3">
                  {[
                    { name: 'Structure / STAR', score: 4, tone: 'bg-success' },
                    { name: 'Specificity and evidence', score: 5, tone: 'bg-success' },
                    { name: 'Ownership and impact', score: 3, tone: 'bg-warning' },
                    { name: 'Reflection and learning', score: 2, tone: 'bg-danger' },
                  ].map((dim) => (
                    <div key={dim.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-text">{dim.name}</span>
                        <span className="font-mono font-medium text-text">{dim.score} / 5</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                        <div
                          className={`h-full rounded-full ${dim.tone}`}
                          style={{ width: `${(dim.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-[8px] border border-border bg-bg p-4">
                  <p className="text-xs font-medium text-text flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-primary" />
                    Top Fix #1 — Add measurable reflection
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Your answer stopped at the launch metric. Close with what you would change next
                    time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-10 max-w-2xl space-y-2">
            <h2 className="text-2xl font-semibold text-text sm:text-3xl">Simple pricing</h2>
            <p className="text-text-muted">Start free. Upgrade only when you need unlimited mocks.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <p className="font-mono text-3xl font-semibold text-text">$0</p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-text-muted">
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />3 mock sessions / month (up to 15 min)
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  Full question bank & basic rubric report
                </p>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link href="/auth/login">Start free</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-primary/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pro</CardTitle>
                  <Badge variant="primary">
                    <Sparkles className="h-3 w-3" />
                    Full access
                  </Badge>
                </div>
                <p className="font-mono text-3xl font-semibold text-text">
                  $19<span className="text-sm font-normal text-text-muted">/month</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-text-muted">
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  Unlimited mocks across all tracks & formats
                </p>
                <p className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" />
                  Full reports, replay, drills, and Interview Plan
                </p>
                <Button className="mt-4 w-full" asChild>
                  <Link href="/pricing">View full pricing</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <h2 className="mb-8 text-2xl font-semibold text-text sm:text-3xl">FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {FAQS.map((faq) => (
              <Card key={faq.q}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-muted">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
