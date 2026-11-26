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

export interface StoredStory {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  learning: string;
  metrics: string;
  competencies: string[];
  createdAt: string;
}

export interface InterviewPlanDay {
  day: number;
  date: string;
  focus: string;
  tasks: string[];
}

export interface StoredPlan {
  jobDescription: string;
  interviewDate: string;
  hoursPerDay: number;
  days: InterviewPlanDay[];
  updatedAt: string;
}

const STORIES_KEY = 'prism_stories_v1';
const PLAN_KEY = 'prism_plan_v1';
const SAVED_QS_KEY = 'prism_saved_questions_v1';

export function listStories(): StoredStory[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORIES_KEY) ?? '[]') as StoredStory[];
  } catch {
    return [];
  }
}

export function saveStory(story: StoredStory) {
  if (typeof window === 'undefined') return;
  const all = listStories().filter((s) => s.id !== story.id);
  all.unshift(story);
  localStorage.setItem(STORIES_KEY, JSON.stringify(all));
}

export function deleteStory(id: string) {
  if (typeof window === 'undefined') return;
  const all = listStories().filter((s) => s.id !== id);
  localStorage.setItem(STORIES_KEY, JSON.stringify(all));
}

export function getSavedPlan(): StoredPlan | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(PLAN_KEY);
    return raw ? (JSON.parse(raw) as StoredPlan) : null;
  } catch {
    return null;
  }
}

export function savePlan(plan: StoredPlan) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
}

export function getSavedQuestionIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(SAVED_QS_KEY) ?? '[]') as string[];
  } catch {
    return [];
  }
}

export function toggleSavedQuestionId(id: string): string[] {
  const current = new Set(getSavedQuestionIds());
  if (current.has(id)) current.delete(id);
  else current.add(id);
  const next = Array.from(current);
  if (typeof window !== 'undefined') {
    localStorage.setItem(SAVED_QS_KEY, JSON.stringify(next));
  }
  return next;
}
