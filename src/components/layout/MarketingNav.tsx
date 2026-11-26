import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-text">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary text-xs font-bold text-white"
          >
            P
          </span>
          <span>Prism: Interview</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm text-text-muted md:flex">
          <Link href="/#tracks" className="transition-colors hover:text-text">
            Tracks
          </Link>
          <Link href="/#how-it-works" className="transition-colors hover:text-text">
            How it works
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-text">
            Pricing
          </Link>
          <Link href="/about" className="transition-colors hover:text-text">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/auth/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/login">Start free mock</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
