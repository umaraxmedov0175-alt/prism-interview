import type { SeedQuestion } from '@/lib/ai/question-bank';
import type { ReportOutput } from '@/lib/ai/schemas/report';
import type { DeliveryMetrics } from '@/lib/metrics/delivery';

export interface StoredSession {
  id: string;
  trackSlug: string;
  formatSlug: string;
  level: string;
  role: string;
  companyName?: string;
  jobDescription?: string;
  durationMinutes: number;
  difficulty: 'warm-up' | 'realistic' | 'tough';
  persona: 'friendly' | 'neutral' | 'skeptical';
  interviewLanguage: string;
  questionPlan: SeedQuestion[];
  turns: Array<{ speaker: 'ai' | 'user'; text: string; startMs: number; endMs: number }>;
  createdAt: string;
}

export interface StoredReport {
  id: string;
  sessionId: string;
  trackSlug: string;
  level: string;
  role: string;
  createdAt: string;
  modelVersion: string;
  promptVersion: string;
  report: ReportOutput;
  deliveryMetrics: DeliveryMetrics;
}

const SESSIONS_KEY = 'prism_sessions_v1';
const REPORTS_KEY = 'prism_reports_v1';

export function saveSession(session: StoredSession) {
  if (typeof window === 'undefined') return;
  const all = listSessions().filter((s) => s.id !== session.id);
  all.unshift(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(all.slice(0, 50)));
}

export function getSession(id: string): StoredSession | null {
  return listSessions().find((s) => s.id === id) ?? null;
}

export function listSessions(): StoredSession[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) ?? '[]') as StoredSession[];
  } catch {
    return [];
  }
}

export function saveReport(report: StoredReport) {
  if (typeof window === 'undefined') return;
  const all = listReports().filter((r) => r.id !== report.id);
  all.unshift(report);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(all.slice(0, 50)));
}

export function getReport(id: string): StoredReport | null {
  return listReports().find((r) => r.id === id) ?? null;
}

export function listReports(): StoredReport[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(REPORTS_KEY) ?? '[]') as StoredReport[];
  } catch {
    return [];
  }
}
