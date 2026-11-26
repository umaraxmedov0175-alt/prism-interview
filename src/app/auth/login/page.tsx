'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleGoogleLogin() {
    setStatus('loading');
    setErrorMsg('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not start Google sign-in.');
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not send magic link.');
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sign in to Prism: Interview</CardTitle>
            <CardDescription>
              No passwords stored. Continue with Google or a one-time email link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={status === 'loading'}
            >
              Continue with Google
            </Button>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-border" />
              <span className="mx-3 shrink text-xs text-text-muted">or</span>
              <div className="flex-grow border-t border-border" />
            </div>

            {status === 'sent' ? (
              <div className="rounded-[8px] border border-success/30 bg-success/10 p-4 text-sm text-text">
                Check your inbox at <span className="font-mono font-medium">{email}</span> for your
                sign-in link.
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-3">
                <label htmlFor="email" className="block text-xs font-medium text-text">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-10 w-full rounded-[8px] border border-border bg-bg px-3 text-sm text-text placeholder:text-text-muted"
                />
                <Button type="submit" className="w-full" disabled={status === 'loading'}>
                  <Mail className="h-4 w-4" />
                  Send magic link
                </Button>
              </form>
            )}

            {status === 'error' && (
              <p role="alert" className="text-xs text-danger">
                {errorMsg}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
