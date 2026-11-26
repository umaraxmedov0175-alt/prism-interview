'use client';

import * as React from 'react';
import {
  CheckCircle2,
  Code2,
  Lightbulb,
  Play,
  RotateCcw,
  Save,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CODING_PROBLEMS, type CodingProblem, type CodingTestCase } from '@/lib/ai/coding-problems';
import { cn } from '@/lib/utils';

export interface CodingRoomProps {
  initialProblemId?: string;
  onSnapshot?: (code: string, testSummary: string, hintsUsed: number) => void;
  className?: string;
}

interface TestResult {
  index: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

const EXECUTION_TIMEOUT_MS = 1500;

function runInWorkerWithTimeout(
  code: string,
  test: CodingTestCase,
  timeoutMs: number
): Promise<{ actual: string; error?: string }> {
  return new Promise((resolve) => {
    if (typeof Worker === 'undefined' || typeof Blob === 'undefined') {
      try {
        const fn = new Function(`${code}\nreturn (${test.fnCall});`);
        const raw = fn();
        resolve({ actual: raw === undefined ? 'undefined' : String(raw) });
      } catch (err) {
        resolve({
          actual: '',
          error: err instanceof Error ? err.message : String(err),
        });
      }
      return;
    }

    const workerScript = `
      self.onmessage = function(e) {
        const { code, fnCall } = e.data;
        try {
          const fn = new Function(code + "\\nreturn (" + fnCall + ");");
          const result = fn();
          self.postMessage({
            ok: true,
            actual: result === undefined ? "undefined" : String(result)
          });
        } catch (err) {
          self.postMessage({
            ok: false,
            error: err && err.message ? err.message : String(err)
          });
        }
      };
    `;

    const blob = new Blob([workerScript], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);

    let settled = false;
    const cleanup = () => {
      worker.terminate();
      URL.revokeObjectURL(url);
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve({
        actual: '',
        error: `Execution timed out (>${timeoutMs}ms). Check for infinite loops.`,
      });
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent<{ ok: boolean; actual?: string; error?: string }>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      if (event.data.ok) {
        resolve({ actual: event.data.actual ?? '' });
      } else {
        resolve({ actual: '', error: event.data.error ?? 'Runtime error' });
      }
    };

    worker.onerror = (event) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      resolve({ actual: '', error: event.message || 'Syntax or runtime error' });
    };

    worker.postMessage({ code, fnCall: test.fnCall });
  });
}

function formatTestSummary(results: TestResult[]): string {
  if (results.length === 0) return 'Tests not run yet';
  const passed = results.filter((r) => r.passed).length;
  return `${passed}/${results.length} tests passed`;
}

export function CodingRoom({ initialProblemId, onSnapshot, className }: CodingRoomProps) {
  const defaultProblem =
    CODING_PROBLEMS.find((p) => p.id === initialProblemId) ?? CODING_PROBLEMS[0];

  const [selectedId, setSelectedId] = React.useState<string>(defaultProblem.id);
  const [codeByProblem, setCodeByProblem] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(CODING_PROBLEMS.map((p) => [p.id, p.starterCode]))
  );
  const [resultsByProblem, setResultsByProblem] = React.useState<Record<string, TestResult[]>>({});
  const [revealedHints, setRevealedHints] = React.useState<Record<string, boolean>>({});
  const [hintsUsed, setHintsUsed] = React.useState<number>(0);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);
  const [snapshotSavedAt, setSnapshotSavedAt] = React.useState<string | null>(null);

  const editorId = React.useId();

  const problem: CodingProblem =
    CODING_PROBLEMS.find((p) => p.id === selectedId) ?? CODING_PROBLEMS[0];
  const code = codeByProblem[problem.id] ?? problem.starterCode;
  const results = resultsByProblem[problem.id] ?? [];
  const hintRevealed = Boolean(revealedHints[problem.id]);

  const passedCount = results.filter((r) => r.passed).length;
  const testSummary = formatTestSummary(results);

  const handleCodeChange = (nextCode: string) => {
    setCodeByProblem((prev) => ({ ...prev, [problem.id]: nextCode }));
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = `${code.slice(0, start)}  ${code.slice(end)}`;
      handleCodeChange(updated);
      requestAnimationFrame(() => {
        target.selectionStart = start + 2;
        target.selectionEnd = start + 2;
      });
    }
  };

  const handleReset = () => {
    setCodeByProblem((prev) => ({ ...prev, [problem.id]: problem.starterCode }));
    setResultsByProblem((prev) => ({ ...prev, [problem.id]: [] }));
  };

  const handleAskHint = () => {
    if (!hintRevealed) {
      setRevealedHints((prev) => ({ ...prev, [problem.id]: true }));
      setHintsUsed((count) => count + 1);
    }
  };

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      const nextResults: TestResult[] = [];
      for (let i = 0; i < problem.visibleTests.length; i += 1) {
        const test = problem.visibleTests[i];
        const outcome = await runInWorkerWithTimeout(code, test, EXECUTION_TIMEOUT_MS);
        const passed = !outcome.error && outcome.actual === test.expected;
        nextResults.push({
          index: i + 1,
          input: test.input,
          expected: test.expected,
          actual: outcome.actual,
          passed,
          error: outcome.error,
        });
      }
      setResultsByProblem((prev) => ({ ...prev, [problem.id]: nextResults }));
      if (onSnapshot) {
        onSnapshot(code, formatTestSummary(nextResults), hintsUsed);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleCaptureSnapshot = () => {
    onSnapshot?.(code, testSummary, hintsUsed);
    setSnapshotSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <section
      aria-label="Coding workspace"
      className={cn(
        'flex flex-col rounded-[12px] border border-border bg-bg text-text overflow-hidden',
        className
      )}
    >
      {/* Top toolbar: problem selector & actions */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-text mr-1">
            <Code2 className="h-4 w-4 text-primary" aria-hidden="true" />
            Coding Room
          </span>
          <div role="tablist" aria-label="Coding problems" className="flex flex-wrap gap-1.5">
            {CODING_PROBLEMS.map((item) => {
              const isSelected = item.id === problem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    'rounded-[8px] border px-3 py-1.5 text-xs font-medium transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-bg text-text-muted hover:text-text'
                  )}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">Hints used: {hintsUsed}</Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAskHint}
            disabled={hintRevealed}
          >
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
            {hintRevealed ? 'Hint shown' : 'Ask for hint'}
          </Button>
          {onSnapshot && (
            <Button type="button" variant="secondary" size="sm" onClick={handleCaptureSnapshot}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              {snapshotSavedAt ? `Synced ${snapshotSavedAt}` : 'Capture snapshot'}
            </Button>
          )}
        </div>
      </header>

      {/* Main split workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12">
        {/* Left pane: prompt, hint & test cases */}
        <div className="flex flex-col gap-4 border-b border-border bg-surface/50 p-4 xl:col-span-5 xl:border-b-0 xl:border-r">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-text">{problem.title}</h2>
            <Badge variant={problem.difficulty === 'Easy' ? 'success' : 'warning'}>
              {problem.difficulty}
            </Badge>
          </div>

          <p className="text-sm leading-relaxed text-text-muted">{problem.prompt}</p>

          {hintRevealed && (
            <div
              role="note"
              aria-label="Problem hint"
              className="rounded-[8px] border border-primary/30 bg-primary/5 p-3 text-xs leading-relaxed text-text"
            >
              <p className="mb-1 font-semibold text-primary">Hint</p>
              <p className="text-text-muted">{problem.hint}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Visible test cases
              </h3>
              {results.length > 0 && (
                <Badge variant={passedCount === results.length ? 'success' : 'danger'}>
                  {passedCount}/{results.length} passed
                </Badge>
              )}
            </div>

            <ul className="flex flex-col gap-2">
              {problem.visibleTests.map((test, idx) => {
                const res = results[idx];
                return (
                  <li
                    key={test.input}
                    className="rounded-[8px] border border-border bg-bg p-3 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-medium text-text">Case {idx + 1}</span>
                      {res ? (
                        <Badge variant={res.passed ? 'success' : 'danger'}>
                          {res.passed ? (
                            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <XCircle className="h-3 w-3" aria-hidden="true" />
                          )}
                          {res.passed ? 'Pass' : 'Fail'}
                        </Badge>
                      ) : (
                        <Badge variant="neutral">Not run</Badge>
                      )}
                    </div>
                    <div className="space-y-1 font-mono text-[11px] text-text-muted">
                      <p>
                        <span className="text-text">Input:</span> {test.input}
                      </p>
                      <p>
                        <span className="text-text">Expected:</span> {test.expected}
                      </p>
                      {res && !res.passed && (
                        <p className="text-danger">
                          {res.error ? `Error: ${res.error}` : `Actual: ${res.actual}`}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Right pane: monospace editor & run controls */}
        <div className="flex flex-col xl:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface px-4 py-2">
            <label htmlFor={editorId} className="font-mono text-xs font-medium text-text-muted">
              solution.js (JavaScript)
            </label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleRunTests}
                disabled={isRunning}
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                {isRunning ? 'Running...' : 'Run tests'}
              </Button>
            </div>
          </div>

          <textarea
            id={editorId}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={handleEditorKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label={`JavaScript code editor for ${problem.title}`}
            className="min-h-[340px] w-full flex-1 resize-y bg-bg p-4 font-mono text-sm leading-relaxed text-text focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>
    </section>
  );
}
