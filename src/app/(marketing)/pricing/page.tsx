import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for Prism: Interview.',
};

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    badge: null,
    features: [
      '3 mock sessions per month (max 15 min)',
      'Full public question bank',
      'Basic rubric & delivery report',
    ],
    cta: 'Start free',
    href: '/auth/login',
    variant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month (or $99/year)',
    badge: 'Most popular',
    features: [
      'Unlimited mock sessions',
      'All tracks and formats (coding, whiteboard, case)',
      'Full feedback reports, synced replay & drills',
      'Day-by-day Interview Plan',
    ],
    cta: 'Start with Pro',
    href: '/auth/login',
    variant: 'primary' as const,
  },
  {
    name: 'Teams',
    price: 'Custom',
    period: 'per seat',
    badge: 'Career centers & bootcamps',
    features: [
      'Cohort dashboard & anonymized progress',
      'Assigned mock sessions',
      'Custom question sets and rubrics',
    ],
    cta: 'Contact us',
    href: '/contact',
    variant: 'outline' as const,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-24">
      <div className="mb-12 max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold text-text sm:text-4xl">Pricing</h1>
        <p className="text-text-muted">
          Practice for free, or unlock unlimited mocks and technical rooms when you are actively
          interviewing.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={plan.badge === 'Most popular' ? 'border-primary/50' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.badge && <Badge variant="primary">{plan.badge}</Badge>}
              </div>
              <div className="pt-2">
                <span className="font-mono text-3xl font-semibold text-text">{plan.price}</span>
                <span className="ml-2 text-xs text-text-muted">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2.5 text-sm text-text-muted">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.variant} className="w-full" asChild>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
