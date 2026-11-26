import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-bg py-12">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-8 px-4 sm:flex-row sm:px-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold text-text">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-primary text-[11px] font-bold text-white"
            >
              P
            </span>
            <span>Prism: Interview</span>
          </div>
          <p className="max-w-xs text-sm text-text-muted">
            Honest AI interview practice. We train you before the interview—never during it.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
          <div className="space-y-2">
            <p className="font-medium text-text">Product</p>
            <ul className="space-y-1.5 text-text-muted">
              <li>
                <Link href="/#tracks" className="hover:text-text">
                  Tracks
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-text">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-text">
                  Start free mock
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-text">Company</p>
            <ul className="space-y-1.5 text-text-muted">
              <li>
                <Link href="/about" className="hover:text-text">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-text">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-text">Legal</p>
            <ul className="space-y-1.5 text-text-muted">
              <li>
                <Link href="/privacy" className="hover:text-text">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-text">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
