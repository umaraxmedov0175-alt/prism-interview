'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  HelpCircle,
  Home,
  Menu,
  Mic,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Target,
  X,
} from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/app', label: 'Dashboard', icon: Home },
  { href: '/app/practice/new', label: 'New Mock', icon: Mic },
  { href: '/app/reports', label: 'Reports', icon: FileText },
  { href: '/app/drills', label: 'Drills', icon: Target },
  { href: '/app/stories', label: 'Story Bank', icon: BookOpen },
  { href: '/app/plan', label: 'Interview Plan', icon: Calendar },
  { href: '/app/questions', label: 'Questions', icon: HelpCircle },
  { href: '/app/progress', label: 'Progress', icon: BarChart3 },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCmdOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const filteredNav = NAV_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-bg text-text">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden border-r border-border bg-surface transition-all duration-200 md:flex md:flex-col',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link href="/app" className="flex items-center gap-2 font-semibold text-text">
              <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-primary text-xs font-bold text-white">
                P
              </span>
              <span className="truncate">Prism: Interview</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-text-muted hover:bg-bg hover:text-text"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav aria-label="App navigation" className="flex-1 space-y-1 p-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-muted hover:bg-bg hover:text-text'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 flex w-64 flex-col border-r border-border bg-surface">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="font-semibold text-text">Prism: Interview</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-text-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav aria-label="Mobile navigation" className="space-y-1 p-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-medium',
                      active ? 'bg-primary/10 text-primary' : 'text-text-muted hover:text-text'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-bg px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-border bg-surface text-text md:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-border bg-surface px-3 text-xs text-text-muted hover:text-text"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Quick jump</span>
              <kbd className="rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px]">
                Cmd+K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <Button size="sm" asChild>
              <Link href="/app/practice/new">New mock</Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>

      {/* Command Palette */}
      {cmdOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick navigation"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-24 px-4"
          onClick={() => setCmdOpen(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-[12px] border border-border bg-bg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center border-b border-border px-3">
              <Search className="h-4 w-4 text-text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to..."
                className="h-11 w-full bg-transparent px-3 text-sm text-text outline-none placeholder:text-text-muted"
              />
            </div>
            <div className="p-2">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      setCmdOpen(false);
                      setQuery('');
                      router.push(item.href);
                    }}
                    className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left text-sm text-text hover:bg-surface"
                  >
                    <Icon className="h-4 w-4 text-text-muted" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
