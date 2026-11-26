'use client';

import * as React from 'react';
import {
  ArrowRight,
  Camera,
  Check,
  Database,
  Pen,
  Server,
  Square,
  Trash2,
  Undo2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const SYSTEM_DESIGN_PHASES = [
  'Requirements',
  'Estimates',
  'API',
  'Data Model',
  'High-Level Design',
  'Deep Dives',
  'Trade-offs',
] as const;

export type SystemDesignPhase = (typeof SYSTEM_DESIGN_PHASES)[number];

export type WhiteboardTool = 'box' | 'arrow' | 'pen';
export type BoxKind = 'service' | 'db';

interface Point {
  x: number;
  y: number;
}

interface BoxElement {
  id: string;
  type: 'box';
  kind: BoxKind;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

interface ArrowElement {
  id: string;
  type: 'arrow';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface PenElement {
  id: string;
  type: 'pen';
  points: Point[];
}

type WhiteboardElement = BoxElement | ArrowElement | PenElement;

export interface WhiteboardRoomProps {
  onSnapshot?: (summaryText: string, currentPhase: SystemDesignPhase) => void;
  initialPhase?: SystemDesignPhase;
  initialSummary?: string;
  className?: string;
}

function buildSvgPath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const p = points[0];
    return `M ${p.x} ${p.y} L ${p.x + 0.1} ${p.y + 0.1}`;
  }
  return points
    .map((p, index) => `${index === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');
}

function normalizeBox(start: Point, end: Point): { x: number; y: number; width: number; height: number } {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);
  return { x, y, width, height };
}

export function WhiteboardRoom({
  onSnapshot,
  initialPhase = 'Requirements',
  initialSummary = '',
  className,
}: WhiteboardRoomProps) {
  const [currentPhase, setCurrentPhase] = React.useState<SystemDesignPhase>(initialPhase);
  const [activeTool, setActiveTool] = React.useState<WhiteboardTool>('box');
  const [boxKind, setBoxKind] = React.useState<BoxKind>('service');
  const [elements, setElements] = React.useState<WhiteboardElement[]>([]);
  const [draftElement, setDraftElement] = React.useState<WhiteboardElement | null>(null);
  const [editingBoxId, setEditingBoxId] = React.useState<string | null>(null);
  const [editingLabel, setEditingLabel] = React.useState('');
  const [summaryText, setSummaryText] = React.useState(initialSummary);
  const [snapshotSaved, setSnapshotSaved] = React.useState(false);

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const dragStartRef = React.useRef<Point | null>(null);
  const nextIdRef = React.useRef(1);
  const snapshotTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (snapshotTimerRef.current) {
        clearTimeout(snapshotTimerRef.current);
      }
    };
  }, []);

  const getRelativePoint = (e: React.PointerEvent<SVGSVGElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(rect.width, e.clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, e.clientY - rect.top)),
    };
  };

  const handleUndo = React.useCallback(() => {
    setElements((prev) => prev.slice(0, -1));
    setEditingBoxId(null);
  }, []);

  const handleClear = React.useCallback(() => {
    setElements([]);
    setDraftElement(null);
    setEditingBoxId(null);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    if (editingBoxId) {
      commitBoxLabel();
    }

    const pt = getRelativePoint(e);
    dragStartRef.current = pt;
    e.currentTarget.setPointerCapture(e.pointerId);

    const id = `el-${nextIdRef.current++}`;
    if (activeTool === 'box') {
      const boxCount = elements.filter((el) => el.type === 'box' && el.kind === boxKind).length + 1;
      setDraftElement({
        id,
        type: 'box',
        kind: boxKind,
        x: pt.x,
        y: pt.y,
        width: 0,
        height: 0,
        label: boxKind === 'db' ? `DB ${boxCount}` : `Service ${boxCount}`,
      });
    } else if (activeTool === 'arrow') {
      setDraftElement({
        id,
        type: 'arrow',
        x1: pt.x,
        y1: pt.y,
        x2: pt.x,
        y2: pt.y,
      });
    } else {
      setDraftElement({
        id,
        type: 'pen',
        points: [pt],
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragStartRef.current || !draftElement) return;
    const pt = getRelativePoint(e);
    const start = dragStartRef.current;

    if (draftElement.type === 'box') {
      const { x, y, width, height } = normalizeBox(start, pt);
      setDraftElement({ ...draftElement, x, y, width, height });
    } else if (draftElement.type === 'arrow') {
      setDraftElement({ ...draftElement, x2: pt.x, y2: pt.y });
    } else if (draftElement.type === 'pen') {
      setDraftElement({
        ...draftElement,
        points: [...draftElement.points, pt],
      });
    }
  };

  const finishDrawing = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragStartRef.current || !draftElement) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    let finalized: WhiteboardElement | null = draftElement;

    if (draftElement.type === 'box') {
      // Single click places a standard-sized node; drag uses drawn bounds.
      if (draftElement.width < 12 && draftElement.height < 12) {
        finalized = {
          ...draftElement,
          x: Math.max(8, draftElement.x - 72),
          y: Math.max(8, draftElement.y - 30),
          width: 144,
          height: 60,
        };
      } else if (draftElement.width < 24 || draftElement.height < 20) {
        finalized = {
          ...draftElement,
          width: Math.max(draftElement.width, 96),
          height: Math.max(draftElement.height, 44),
        };
      }
    } else if (draftElement.type === 'arrow') {
      const dx = draftElement.x2 - draftElement.x1;
      const dy = draftElement.y2 - draftElement.y1;
      if (Math.hypot(dx, dy) < 8) {
        finalized = null;
      }
    }

    if (finalized) {
      setElements((prev) => [...prev, finalized]);
    }
    dragStartRef.current = null;
    setDraftElement(null);
  };

  const startEditingBox = (box: BoxElement, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBoxId(box.id);
    setEditingLabel(box.label);
  };

  const commitBoxLabel = () => {
    if (!editingBoxId) return;
    const trimmed = editingLabel.trim();
    if (trimmed) {
      setElements((prev) =>
        prev.map((el) =>
          el.id === editingBoxId && el.type === 'box' ? { ...el, label: trimmed } : el
        )
      );
    }
    setEditingBoxId(null);
  };

  const handleCaptureSnapshot = () => {
    onSnapshot?.(summaryText, currentPhase);
    setSnapshotSaved(true);
    if (snapshotTimerRef.current) {
      clearTimeout(snapshotTimerRef.current);
    }
    snapshotTimerRef.current = setTimeout(() => {
      setSnapshotSaved(false);
    }, 2000);
  };

  const currentPhaseIndex = SYSTEM_DESIGN_PHASES.indexOf(currentPhase);
  const renderedElements = draftElement ? [...elements, draftElement] : elements;
  const editingBox = editingBoxId
    ? elements.find((el): el is BoxElement => el.id === editingBoxId && el.type === 'box')
    : null;

  return (
    <section
      aria-label="System Design Whiteboard"
      className={cn(
        'flex flex-col gap-3 rounded-[12px] border border-border bg-bg p-3 text-text sm:p-4',
        className
      )}
    >
      {/* Phase tracker pills */}
      <nav aria-label="System design phases" className="overflow-x-auto pb-1">
        <ol className="flex min-w-max items-center gap-1.5">
          {SYSTEM_DESIGN_PHASES.map((phase, index) => {
            const isActive = phase === currentPhase;
            const isCompleted = index < currentPhaseIndex;
            return (
              <React.Fragment key={phase}>
                <li>
                  <button
                    type="button"
                    onClick={() => setCurrentPhase(phase)}
                    aria-current={isActive ? 'step' : undefined}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                      isActive
                        ? 'border-primary bg-primary text-white'
                        : isCompleted
                          ? 'border-border bg-surface text-text hover:border-primary/40'
                          : 'border-border bg-bg text-text-muted hover:bg-surface hover:text-text'
                    )}
                  >
                    {isCompleted && <Check className="h-3 w-3 text-primary" aria-hidden="true" />}
                    <span>{phase}</span>
                  </button>
                </li>
                {index < SYSTEM_DESIGN_PHASES.length - 1 && (
                  <li aria-hidden="true" className="text-text-muted/60">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>

      {/* Main workspace: Canvas + Notes panel */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_320px]">
        {/* Left: Toolbar + Canvas */}
        <div className="flex flex-col overflow-hidden rounded-[12px] border border-border bg-surface">
          {/* Tool selector bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-bg px-3 py-2">
            <div className="flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Whiteboard tools">
              <button
                type="button"
                onClick={() => setActiveTool('box')}
                aria-pressed={activeTool === 'box'}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1.5 text-xs font-medium transition-colors',
                  activeTool === 'box'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-bg text-text hover:bg-surface'
                )}
              >
                <Square className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Box (Service/DB)</span>
              </button>

              {activeTool === 'box' && (
                <div
                  className="inline-flex items-center rounded-[8px] border border-border bg-surface p-0.5"
                  role="group"
                  aria-label="Box node type"
                >
                  <button
                    type="button"
                    onClick={() => setBoxKind('service')}
                    aria-pressed={boxKind === 'service'}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-[11px] font-medium transition-colors',
                      boxKind === 'service'
                        ? 'bg-bg text-text shadow-xs'
                        : 'text-text-muted hover:text-text'
                    )}
                  >
                    <Server className="h-3 w-3" aria-hidden="true" />
                    <span>Service</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoxKind('db')}
                    aria-pressed={boxKind === 'db'}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-[11px] font-medium transition-colors',
                      boxKind === 'db'
                        ? 'bg-bg text-text shadow-xs'
                        : 'text-text-muted hover:text-text'
                    )}
                  >
                    <Database className="h-3 w-3" aria-hidden="true" />
                    <span>DB</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveTool('arrow')}
                aria-pressed={activeTool === 'arrow'}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1.5 text-xs font-medium transition-colors',
                  activeTool === 'arrow'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-bg text-text hover:bg-surface'
                )}
              >
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Arrow/Line</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTool('pen')}
                aria-pressed={activeTool === 'pen'}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-[8px] border px-2.5 py-1.5 text-xs font-medium transition-colors',
                  activeTool === 'pen'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-bg text-text hover:bg-surface'
                )}
              >
                <Pen className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Freehand Pen</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={elements.length === 0}
              >
                <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Undo</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={elements.length === 0}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Clear</span>
              </Button>
            </div>
          </div>

          {/* Drawing canvas */}
          <div className="relative h-[420px] w-full select-none sm:h-[480px]">
            <svg
              ref={svgRef}
              role="img"
              aria-label="System design drawing canvas"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrawing}
              onPointerCancel={finishDrawing}
              className="h-full w-full touch-none cursor-crosshair bg-surface"
            >
              <defs>
                <pattern
                  id="whiteboard-dot-grid"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="10" cy="10" r="1" className="fill-border" />
                </pattern>
                <marker
                  id="whiteboard-arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" className="fill-text" />
                </marker>
              </defs>

              <rect width="100%" height="100%" fill="url(#whiteboard-dot-grid)" />

              {renderedElements.map((el) => {
                if (el.type === 'box') {
                  const isDb = el.kind === 'db';
                  return (
                    <g
                      key={el.id}
                      onDoubleClick={(e) => startEditingBox(el, e)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={el.x}
                        y={el.y}
                        width={el.width}
                        height={el.height}
                        rx={8}
                        className={cn(
                          'fill-bg stroke-[1.75]',
                          isDb ? 'stroke-primary' : 'stroke-text'
                        )}
                      />
                      {isDb && (
                        <line
                          x1={el.x}
                          y1={el.y + 14}
                          x2={el.x + el.width}
                          y2={el.y + 14}
                          className="stroke-primary/40 stroke-1"
                        />
                      )}
                      {el.width >= 48 && el.height >= 28 && (
                        <text
                          x={el.x + el.width / 2}
                          y={el.y + (isDb ? el.height / 2 + 6 : el.height / 2 + 4)}
                          textAnchor="middle"
                          className="fill-text font-sans text-xs font-medium select-none"
                        >
                          {el.label}
                        </text>
                      )}
                    </g>
                  );
                }

                if (el.type === 'arrow') {
                  return (
                    <line
                      key={el.id}
                      x1={el.x1}
                      y1={el.y1}
                      x2={el.x2}
                      y2={el.y2}
                      className="stroke-text stroke-2"
                      markerEnd="url(#whiteboard-arrowhead)"
                    />
                  );
                }

                return (
                  <path
                    key={el.id}
                    d={buildSvgPath(el.points)}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="stroke-primary stroke-2"
                  />
                );
              })}
            </svg>

            {elements.length === 0 && !draftElement && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center">
                <p className="max-w-xs text-xs text-text-muted">
                  Click or drag to add a Service/DB box, draw arrows between components, or sketch
                  freely. Double-click any box to rename it.
                </p>
              </div>
            )}

            {editingBox && (
              <div
                style={{
                  left: `clamp(8px, ${editingBox.x}px, calc(100% - 164px))`,
                  top: Math.max(8, editingBox.y + editingBox.height + 6),
                }}
                className="absolute z-10 flex items-center gap-1 rounded-[8px] border border-border bg-bg p-1 shadow-sm"
              >
                <input
                  type="text"
                  value={editingLabel}
                  onChange={(e) => setEditingLabel(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitBoxLabel();
                    if (e.key === 'Escape') setEditingBoxId(null);
                  }}
                  onBlur={commitBoxLabel}
                  autoFocus
                  aria-label="Rename component box"
                  className="h-7 w-36 rounded-[8px] border border-border bg-surface px-2 text-xs text-text focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Notes & Snapshot */}
        <aside className="flex flex-col justify-between gap-3 rounded-[12px] border border-border bg-surface p-3">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="whiteboard-architecture-summary"
                className="text-xs font-semibold text-text"
              >
                Architecture Notes & Summary
              </label>
              <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[11px] text-primary">
                {currentPhase}
              </span>
            </div>

            <textarea
              id="whiteboard-architecture-summary"
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              placeholder={`Capture ${currentPhase.toLowerCase()} notes, capacity math, endpoints, schema, or trade-offs...`}
              rows={12}
              className="min-h-[240px] w-full flex-1 resize-y rounded-[8px] border border-border bg-bg p-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-3">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{elements.length} diagram element{elements.length === 1 ? '' : 's'}</span>
              {snapshotSaved && (
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Snapshot captured
                </span>
              )}
            </div>

            <Button type="button" variant="primary" size="md" onClick={handleCaptureSnapshot} className="w-full">
              <Camera className="h-4 w-4" aria-hidden="true" />
              <span>Capture snapshot</span>
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default WhiteboardRoom;
