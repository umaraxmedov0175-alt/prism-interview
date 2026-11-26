'use client';

import * as React from 'react';
import {
  Briefcase,
  Calculator,
  ChevronRight,
  Eye,
  FileText,
  Layers,
  RotateCcw,
  Save,
} from 'lucide-react';
import { CASE_LIBRARY, type CaseStudy } from '@/lib/ai/cases';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface CaseRoomProps {
  onSnapshot?: (scratchpadText: string, revealedCount: number) => void;
  initialCaseId?: string;
  className?: string;
}

interface CaseDraftState {
  scratchpad: string;
  revealedCount: number;
}

interface CalcHistoryEntry {
  expression: string;
  result: string;
}

/**
 * Safe recursive-descent arithmetic parser.
 * Supports +, -, *, /, %, parentheses, unary +/-, decimals, and comma-grouped numbers.
 */
function evaluateArithmetic(rawExpression: string): { ok: true; value: number } | { ok: false; error: string } {
  const cleaned = rawExpression.replace(/,/g, '').trim();
  if (!cleaned) {
    return { ok: false, error: 'Enter an expression such as (119.9 - 110) / 110' };
  }

  type Token =
    | { type: 'num'; value: number }
    | { type: 'op'; value: '+' | '-' | '*' | '/' | '%' }
    | { type: 'paren'; value: '(' | ')' };

  const tokens: Token[] = [];
  let i = 0;

  while (i < cleaned.length) {
    const ch = cleaned[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      let dotCount = 0;
      while (i < cleaned.length && /[0-9.]/.test(cleaned[i])) {
        if (cleaned[i] === '.') {
          dotCount += 1;
          if (dotCount > 1) {
            return { ok: false, error: 'Invalid decimal number' };
          }
        }
        numStr += cleaned[i];
        i += 1;
      }
      const parsed = Number(numStr);
      if (!Number.isFinite(parsed) || numStr === '.') {
        return { ok: false, error: `Invalid number "${numStr}"` };
      }
      tokens.push({ type: 'num', value: parsed });
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '%') {
      tokens.push({ type: 'op', value: ch });
      i += 1;
      continue;
    }

    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      i += 1;
      continue;
    }

    return { ok: false, error: `Unsupported character "${ch}"` };
  }

  let pos = 0;

  function peek(): Token | undefined {
    return tokens[pos];
  }

  function consume(): Token {
    return tokens[pos++];
  }

  function parseExpression(): number {
    let left = parseTerm();
    while (true) {
      const next = peek();
      if (next?.type === 'op' && (next.value === '+' || next.value === '-')) {
        consume();
        const right = parseTerm();
        left = next.value === '+' ? left + right : left - right;
      } else {
        break;
      }
    }
    return left;
  }

  function parseTerm(): number {
    let left = parseFactor();
    while (true) {
      const next = peek();
      if (next?.type === 'op' && (next.value === '*' || next.value === '/' || next.value === '%')) {
        consume();
        const right = parseFactor();
        if (next.value === '*') {
          left *= right;
        } else if (next.value === '/') {
          if (right === 0) throw new Error('Division by zero');
          left /= right;
        } else {
          if (right === 0) throw new Error('Division by zero');
          left %= right;
        }
      } else {
        break;
      }
    }
    return left;
  }

  function parseFactor(): number {
    const next = peek();
    if (!next) {
      throw new Error('Unexpected end of expression');
    }

    if (next.type === 'op' && (next.value === '+' || next.value === '-')) {
      consume();
      const operand = parseFactor();
      return next.value === '-' ? -operand : operand;
    }

    if (next.type === 'num') {
      consume();
      return next.value;
    }

    if (next.type === 'paren' && next.value === '(') {
      consume();
      const inner = parseExpression();
      const closing = peek();
      if (closing?.type !== 'paren' || closing.value !== ')') {
        throw new Error('Missing closing parenthesis');
      }
      consume();
      return inner;
    }

    throw new Error('Unexpected token in expression');
  }

  try {
    const value = parseExpression();
    if (pos < tokens.length) {
      return { ok: false, error: 'Unexpected trailing input' };
    }
    if (!Number.isFinite(value)) {
      return { ok: false, error: 'Result is not a finite number' };
    }
    return { ok: true, value };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Invalid arithmetic expression',
    };
  }
}

function formatCalcNumber(value: number): string {
  if (Number.isInteger(value)) {
    return value.toLocaleString('en-US');
  }
  return Number(value.toFixed(4)).toLocaleString('en-US', {
    maximumFractionDigits: 4,
  });
}

function buildFrameworkTemplate(caseStudy: CaseStudy): string {
  const sections = caseStudy.referenceStructure.map((item) => `## ${item}\n- `);
  return `# ${caseStudy.title} (${caseStudy.type})\n\n${sections.join('\n\n')}\n\n## Recommendation & Next Steps\n- `;
}

export function CaseRoom({ onSnapshot, initialCaseId, className }: CaseRoomProps) {
  const defaultCase =
    CASE_LIBRARY.find((c) => c.id === initialCaseId) ?? CASE_LIBRARY[0];

  const [selectedCaseId, setSelectedCaseId] = React.useState<string>(defaultCase.id);
  const [draftsByCase, setDraftsByCase] = React.useState<Record<string, CaseDraftState>>(() =>
    Object.fromEntries(
      CASE_LIBRARY.map((c) => [
        c.id,
        {
          scratchpad: '',
          revealedCount: 0,
        },
      ])
    )
  );
  const [showStructure, setShowStructure] = React.useState(false);
  const [snapshotSaved, setSnapshotSaved] = React.useState(false);

  const [expression, setExpression] = React.useState('');
  const [calcResult, setCalcResult] = React.useState<string | null>(null);
  const [calcError, setCalcError] = React.useState<string | null>(null);
  const [calcHistory, setCalcHistory] = React.useState<CalcHistoryEntry[]>([]);

  const activeCase =
    CASE_LIBRARY.find((c) => c.id === selectedCaseId) ?? CASE_LIBRARY[0];
  const activeDraft = draftsByCase[activeCase.id] ?? {
    scratchpad: '',
    revealedCount: 0,
  };

  const visibleExhibits = activeCase.exhibits.slice(0, activeDraft.revealedCount);
  const hasMoreExhibits = activeDraft.revealedCount < activeCase.exhibits.length;

  function updateActiveDraft(updater: (prev: CaseDraftState) => CaseDraftState) {
    setDraftsByCase((prev) => {
      const current = prev[activeCase.id] ?? { scratchpad: '', revealedCount: 0 };
      const next = updater(current);
      return { ...prev, [activeCase.id]: next };
    });
  }

  function handleSelectCase(caseId: string) {
    setSelectedCaseId(caseId);
    setShowStructure(false);
    setSnapshotSaved(false);
  }

  function handleRevealNextExhibit() {
    if (!hasMoreExhibits) return;
    const nextCount = activeDraft.revealedCount + 1;
    updateActiveDraft((prev) => ({
      ...prev,
      revealedCount: Math.min(prev.revealedCount + 1, activeCase.exhibits.length),
    }));
    onSnapshot?.(activeDraft.scratchpad, nextCount);
  }

  function handleScratchpadChange(value: string) {
    setSnapshotSaved(false);
    updateActiveDraft((prev) => ({
      ...prev,
      scratchpad: value,
    }));
  }

  function handleInsertTemplate() {
    const template = buildFrameworkTemplate(activeCase);
    const nextText = activeDraft.scratchpad.trim()
      ? `${activeDraft.scratchpad.trimEnd()}\n\n${template}`
      : template;
    updateActiveDraft((prev) => ({
      ...prev,
      scratchpad: nextText,
    }));
    setSnapshotSaved(false);
    onSnapshot?.(nextText, activeDraft.revealedCount);
  }

  function handleClearScratchpad() {
    updateActiveDraft((prev) => ({
      ...prev,
      scratchpad: '',
    }));
    setSnapshotSaved(false);
    onSnapshot?.('', activeDraft.revealedCount);
  }

  function handleCaptureSnapshot() {
    onSnapshot?.(activeDraft.scratchpad, activeDraft.revealedCount);
    setSnapshotSaved(true);
  }

  function handleEvaluate(e?: React.FormEvent) {
    e?.preventDefault();
    const outcome = evaluateArithmetic(expression);
    if (!outcome.ok) {
      setCalcError(outcome.error);
      setCalcResult(null);
      return;
    }
    const formatted = formatCalcNumber(outcome.value);
    setCalcError(null);
    setCalcResult(formatted);
    setCalcHistory((prev) => [
      { expression: expression.trim(), result: formatted },
      ...prev.slice(0, 3),
    ]);
  }

  function handleAppendResultToScratchpad(entry: CalcHistoryEntry) {
    const line = `${entry.expression} = ${entry.result}`;
    const nextText = activeDraft.scratchpad.trim()
      ? `${activeDraft.scratchpad.trimEnd()}\n${line}`
      : line;
    updateActiveDraft((prev) => ({
      ...prev,
      scratchpad: nextText,
    }));
    onSnapshot?.(nextText, activeDraft.revealedCount);
  }

  return (
    <section
      aria-label="Case Interview Workspace"
      className={cn(
        'flex flex-col gap-5 rounded-[12px] border border-border bg-bg p-5 text-text',
        className
      )}
    >
      {/* Top Bar: Case Selector */}
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-border bg-surface text-primary">
            <Briefcase className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-text">Case Workspace</h2>
            <p className="text-xs text-text-muted">
              Select a case, reveal exhibits progressively, and structure your synthesis.
            </p>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Case selector"
          className="flex flex-wrap items-center gap-2"
        >
          {CASE_LIBRARY.map((item) => {
            const isSelected = item.id === activeCase.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelectCase(item.id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-[8px] border px-3 py-1.5 text-xs font-medium transition-colors',
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-surface text-text-muted hover:border-primary/40 hover:text-text'
                )}
              >
                <span>{item.type}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Left Column: Case Prompt + Progressive Exhibits */}
        <div className="flex flex-col gap-4 xl:col-span-6">
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="primary">{activeCase.type}</Badge>
                <span className="text-xs text-text-muted">
                  Exhibits revealed: {activeDraft.revealedCount} / {activeCase.exhibits.length}
                </span>
              </div>
              <CardTitle className="pt-1 text-lg text-text">{activeCase.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-text">{activeCase.prompt}</p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleRevealNextExhibit}
                  disabled={!hasMoreExhibits}
                >
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  {hasMoreExhibits
                    ? `Reveal next exhibit (${activeDraft.revealedCount + 1}/${activeCase.exhibits.length})`
                    : 'All exhibits revealed'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowStructure((prev) => !prev)}
                  aria-expanded={showStructure}
                >
                  <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                  {showStructure ? 'Hide reference structure' : 'Reference structure'}
                </Button>
              </div>

              {showStructure && (
                <div className="rounded-[8px] border border-border bg-bg p-3.5">
                  <p className="mb-2 text-xs font-semibold text-text">
                    Reference Issue Tree
                  </p>
                  <ul className="space-y-1.5 text-xs text-text-muted">
                    {activeCase.referenceStructure.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <ChevronRight
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Revealed Exhibits */}
          <div className="flex flex-col gap-3" aria-live="polite">
            {visibleExhibits.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-border bg-surface/60 p-5 text-center">
                <p className="text-sm font-medium text-text">No exhibits revealed yet</p>
                <p className="mt-1 text-xs text-text-muted">
                  Outline your initial framework first, then click &ldquo;Reveal next exhibit&rdquo; to inspect data.
                </p>
              </div>
            ) : (
              visibleExhibits.map((exhibit, index) => (
                <Card key={`${activeCase.id}-exhibit-${index}`} className="bg-surface border-border">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-sm font-semibold text-text">
                      {exhibit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="overflow-x-auto rounded-[8px] border border-border bg-bg">
                      <table className="w-full border-collapse text-left text-xs">
                        <tbody>
                          {exhibit.rows.map((row, rowIdx) => (
                            <tr
                              key={rowIdx}
                              className={cn(
                                'border-b border-border last:border-b-0',
                                rowIdx % 2 === 1 && 'bg-surface/50'
                              )}
                            >
                              <td className="px-3 py-2 font-medium text-text-muted">
                                {row.label}
                              </td>
                              <td className="px-3 py-2 text-right font-mono font-medium text-text">
                                {row.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Structured Scratchpad + Quick Math Calculator */}
        <div className="flex flex-col gap-4 xl:col-span-6">
          {/* Case Scratchpad */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                  <CardTitle className="text-sm font-semibold text-text">
                    Structured Case Scratchpad
                  </CardTitle>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleInsertTemplate}
                  >
                    Insert outline
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearScratchpad}
                    disabled={!activeDraft.scratchpad}
                    aria-label="Clear scratchpad"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleCaptureSnapshot}
                  >
                    <Save className="h-3.5 w-3.5" aria-hidden="true" />
                    {snapshotSaved ? 'Saved' : 'Snapshot'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <label htmlFor="case-scratchpad" className="sr-only">
                Structured case scratchpad
              </label>
              <textarea
                id="case-scratchpad"
                value={activeDraft.scratchpad}
                onChange={(e) => handleScratchpadChange(e.target.value)}
                onBlur={() => onSnapshot?.(activeDraft.scratchpad, activeDraft.revealedCount)}
                placeholder="Structure your issue tree, hypotheses, exhibit takeaways, and final recommendation..."
                rows={12}
                className="w-full resize-y rounded-[8px] border border-border bg-bg p-3 font-sans text-sm leading-relaxed text-text placeholder:text-text-muted focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-1 text-xs text-text-muted">
                <span>{activeDraft.scratchpad.length} characters</span>
                <span>Tip: Click &ldquo;Insert outline&rdquo; for a guided issue tree</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Math Calculator */}
          <Card className="bg-surface border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" aria-hidden="true" />
                <CardTitle className="text-sm font-semibold text-text">
                  Quick Math Calculator
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={handleEvaluate} className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="case-math-expression" className="sr-only">
                  Arithmetic expression
                </label>
                <input
                  id="case-math-expression"
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  placeholder="e.g. (119.9 - 110) / 110 * 100"
                  className="h-10 flex-1 rounded-[8px] border border-border bg-bg px-3 font-mono text-sm text-text placeholder:text-text-muted focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                />
                <Button type="submit" variant="primary" size="md">
                  Evaluate
                </Button>
              </form>

              {calcError && (
                <p role="alert" className="text-xs font-medium text-danger">
                  {calcError}
                </p>
              )}

              {calcResult !== null && !calcError && (
                <div className="flex items-center justify-between rounded-[8px] border border-border bg-bg px-3 py-2">
                  <span className="text-xs text-text-muted">Result</span>
                  <span className="font-mono text-base font-semibold text-primary">
                    {calcResult}
                  </span>
                </div>
              )}

              {calcHistory.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-medium text-text-muted">
                    Recent calculations (click to copy to scratchpad)
                  </p>
                  <div className="flex flex-col gap-1">
                    {calcHistory.map((entry, idx) => (
                      <button
                        key={`${entry.expression}-${idx}`}
                        type="button"
                        onClick={() => handleAppendResultToScratchpad(entry)}
                        className="flex items-center justify-between rounded-[8px] border border-border bg-bg px-2.5 py-1.5 text-left font-mono text-xs text-text transition-colors hover:border-primary/50"
                      >
                        <span className="truncate text-text-muted">{entry.expression}</span>
                        <span className="ml-3 shrink-0 font-semibold text-text">
                          = {entry.result}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
