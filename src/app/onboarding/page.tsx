'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LEVELS = [
  { id: 'intern', label: 'Intern' },
  { id: 'junior', label: 'Junior' },
  { id: 'mid', label: 'Mid-level' },
  { id: 'senior', label: 'Senior' },
  { id: 'staff_lead', label: 'Staff / Lead' },
  { id: 'manager', label: 'Manager' },
  { id: 'executive', label: 'Executive' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [level, setLevel] = useState('mid');
  const [companies, setCompanies] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  function handleFinish() {
    router.push('/app');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Step {step} of 5</span>
            <button type="button" onClick={handleFinish} className="hover:text-text">
              Skip to dashboard
            </button>
          </div>
          <CardTitle className="pt-2 text-xl">Set up your practice target</CardTitle>
          <CardDescription>
            This tailors question difficulty and grading bars to your interview.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-2">
              <label htmlFor="targetRole" className="block text-sm font-medium text-text">
                Target role
              </label>
              <input
                id="targetRole"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer, Product Manager, Consultant"
                className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-text">Seniority level</p>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setLevel(lvl.id)}
                    className={`rounded-[8px] border px-3 py-2 text-left text-sm transition-colors ${
                      level === lvl.id
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border bg-bg text-text hover:border-primary/40'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <label htmlFor="companies" className="block text-sm font-medium text-text">
                Target companies (optional)
              </label>
              <input
                id="companies"
                value={companies}
                onChange={(e) => setCompanies(e.target.value)}
                placeholder="e.g. Stripe, Linear, McKinsey"
                className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              <label htmlFor="interviewDate" className="block text-sm font-medium text-text">
                Next interview date (optional)
              </label>
              <input
                id="interviewDate"
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text"
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-text">Resume upload (optional)</p>
              <p className="text-xs text-text-muted">
                You can upload a PDF or DOCX resume anytime in Settings to extract experience items.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 5 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)}>
                Continue
              </Button>
            ) : (
              <Button type="button" onClick={handleFinish}>
                Finish setup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
