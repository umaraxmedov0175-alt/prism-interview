import Link from 'next/link';
import { HeroSandbox } from '@/components/marketing/HeroSandbox';
import { Button } from '@/components/ui/button';

const TRACK_ROWS = [
  {
    slug: 'behavioral',
    name: 'Behavioral & Competency',
    focus: 'STAR structure, personal ownership, conflict, failure, and measurable impact.',
    tool: 'STAR checker',
  },
  {
    slug: 'general-hr',
    name: 'General & HR Screen',
    focus: 'Career narrative, role motivation, strengths, weaknesses, and questions to ask.',
    tool: 'Rubric grading',
  },
  {
    slug: 'software-engineering',
    name: 'Software Engineering',
    focus: 'Data structures, algorithms, debugging, complexity, and code quality.',
    tool: 'Code editor + runner',
  },
  {
    slug: 'system-design',
    name: 'System Design',
    focus: 'Requirements, estimates, APIs, data modeling, scaling, and trade-offs.',
    tool: 'Whiteboard',
  },
  {
    slug: 'consulting',
    name: 'Consulting & Case',
    focus: 'Profitability, market entry, market sizing, exhibits, and case math.',
    tool: 'Exhibits + calculator',
  },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Configure the exact round',
    body: 'Pick track, seniority, format, and paste a job description. No generic question lists.',
  },
  {
    step: '02',
    title: 'Defend vague claims live',
    body: 'The interviewer listens by voice or text, interrupts politely on time, and pushes back when ownership or numbers are missing.',
  },
  {
    step: '03',
    title: 'Drill the exact weak spot',
    body: 'Review transcript-quoted rubric scores, computed speech metrics, and retry single questions side by side.',
  },
];

const FAQS = [
  {
    q: 'Does Prism: Interview work as a live-interview copilot?',
    a: 'No. We never build stealth overlays or hidden answer helpers for real interviews. Prism: Interview is strictly for honest practice before you walk in.',
  },
  {
    q: 'Does the AI write full scripted answers to memorize?',
    a: 'No. The grader builds improved bulleted outlines using only the facts you actually stated, marking missing details for you to supply.',
  },
  {
    q: 'How are delivery metrics computed?',
    a: 'Words per minute, filler words, hedging phrases, pauses, and I/we balance are computed deterministically in code from your transcript—never guessed by an LLM, and we never score accent.',
  },
];

export default function HomePage() {
  return (
    <div className="bg-bg text-text">
      {/* Hero — Asymmetric Split with Live Interactive Sandbox */}
      <section className="border-b border-border py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 lg:col-span-6">
            <h1 className="text-4xl font-semibold tracking-[-0.03em] text-text sm:text-5xl lg:text-[54px] lg:leading-[1.06]">
              Practice the exact interview you are about to face.
            </h1>
            <p className="max-w-[52ch] text-base leading-relaxed text-text-muted sm:text-lg">
              An AI interviewer that listens, asks adaptive follow-ups when your answer is vague,
              and grades every response against a published rubric. Practice-only, 100% free.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button size="lg" asChild>
                <Link href="/app/practice/new">Start a mock interview</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/questions">Browse question bank</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <HeroSandbox />
          </div>
        </div>
      </section>

      {/* Editorial 3-Step Ledger (no card boxes) */}
      <section id="how-it-works" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <h2 className="mb-10 text-2xl font-semibold tracking-[-0.025em] text-text sm:text-3xl">
            How a session works
          </h2>
          <div className="grid divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {WORKFLOW_STEPS.map((item) => (
              <div key={item.step} className="space-y-2 py-6 md:px-6 md:first:pl-0 md:last:pr-0">
                <span className="font-mono text-xs text-primary">{item.step}</span>
                <h3 className="text-base font-semibold text-text">{item.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hairline Track Index (no identical card grid) */}
      <section id="tracks" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-semibold tracking-[-0.025em] text-text sm:text-3xl">
                Interview tracks &amp; workspaces
              </h2>
              <p className="text-sm text-text-muted">
                Every track pairs domain rubrics with a dedicated interactive room.
              </p>
            </div>
            <Link href="/app/practice/new" className="text-sm font-medium text-primary hover:underline">
              Configure a session
            </Link>
          </div>

          <div className="divide-y divide-border border-y border-border">
            {TRACK_ROWS.map((row) => (
              <div
                key={row.slug}
                className="grid gap-3 py-4 sm:grid-cols-12 sm:items-center"
              >
                <div className="sm:col-span-3">
                  <span className="font-medium text-text">{row.name}</span>
                </div>
                <div className="sm:col-span-6">
                  <p className="text-sm text-text-muted">{row.focus}</p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:col-span-3 sm:justify-end">
                  <span className="font-mono text-xs text-text-muted">{row.tool}</span>
                  <Link
                    href="/app/practice/new"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Launch
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Debrief Split */}
      <section id="sample-report" className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-text sm:text-3xl">
              Scored against evidence, not vibes
            </h2>
            <p className="text-sm leading-relaxed text-text-muted">
              Every rubric dimension quotes a specific line from your transcript. Delivery metrics
              are computed deterministically in code, and top fixes link directly to a 2-minute
              retry drill.
            </p>
            <div className="grid grid-cols-2 divide-x divide-border rounded-[12px] border border-border bg-surface p-4">
              <div>
                <p className="text-xs text-text-muted">Sample Score</p>
                <p className="mt-1 font-mono text-3xl font-semibold text-text">78 / 100</p>
              </div>
              <div className="pl-4">
                <p className="text-xs text-text-muted">Computed Pace</p>
                <p className="mt-1 font-mono text-3xl font-semibold text-text">144 WPM</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border rounded-[12px] border border-border bg-surface lg:col-span-7">
            {[
              {
                dim: 'Structure / STAR',
                score: '4 / 5',
                quote: '“I led the query-plan rewrite for the checkout service...”',
                tone: 'text-success',
              },
              {
                dim: 'Specificity and evidence',
                score: '5 / 5',
                quote: '“...reducing p95 latency from 420 ms to 115 ms over three weeks.”',
                tone: 'text-success',
              },
              {
                dim: 'Ownership and impact',
                score: '3 / 5',
                quote: '“We rolled out the index change during the Tuesday deploy.”',
                tone: 'text-warning',
              },
              {
                dim: 'Reflection and learning',
                score: '2 / 5',
                quote: 'No reflection on trade-offs or what would change next time.',
                tone: 'text-danger',
              },
            ].map((item) => (
              <div key={item.dim} className="flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-text">{item.dim}</p>
                  <p className="text-xs text-text-muted">{item.quote}</p>
                </div>
                <span className={`shrink-0 font-mono text-sm font-semibold ${item.tone}`}>
                  {item.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Honest & Free + FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 sm:px-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-4">
            <h2 className="text-2xl font-semibold tracking-[-0.025em] text-text">
              Questions &amp; principles
            </h2>
            <p className="text-sm leading-relaxed text-text-muted">
              100% free to run and practice. No live-interview copilot, no fabricated stories, and
              no hidden paywalls.
            </p>
          </div>
          <div className="divide-y divide-border border-t border-border lg:col-span-8">
            {FAQS.map((faq) => (
              <div key={faq.q} className="space-y-1.5 py-5">
                <h3 className="text-base font-medium text-text">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
