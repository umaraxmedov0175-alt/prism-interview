import { MVP_QUESTIONS, type SeedQuestion } from '@/lib/ai/question-bank';

export interface PublicQuestion extends SeedQuestion {
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  competencies: string[];
  strongAnswerPoints: string[];
  commonMistakes: string[];
}

export const PUBLIC_QUESTIONS: PublicQuestion[] = MVP_QUESTIONS.map((q, idx) => ({
  ...q,
  slug: q.id,
  difficulty: idx % 3 === 0 ? 'easy' : idx % 3 === 1 ? 'medium' : 'hard',
  competencies:
    q.trackSlug === 'behavioral'
      ? ['ownership', 'communication', 'conflict-resolution']
      : q.trackSlug === 'general-hr'
        ? ['communication', 'adaptability']
        : ['problem-solving', 'algorithms', 'system-thinking'],
  strongAnswerPoints: [
    'Clear context and personal ownership ("I" vs "we")',
    'Concrete actions taken and trade-offs considered',
    'Measurable outcome or clear lesson learned',
  ],
  commonMistakes: [
    'Speaking in hypotheticals instead of a real past example',
    'Skipping the measurable result or personal contribution',
  ],
}));

export const COMPETENCY_LIST = [
  { slug: 'leadership', name: 'Leadership' },
  { slug: 'conflict-resolution', name: 'Conflict Resolution' },
  { slug: 'ownership', name: 'Ownership & Impact' },
  { slug: 'ambiguity', name: 'Navigating Ambiguity' },
  { slug: 'communication', name: 'Communication' },
  { slug: 'problem-solving', name: 'Problem Solving' },
  { slug: 'system-thinking', name: 'System Thinking' },
  { slug: 'adaptability', name: 'Adaptability & Learning' },
];

export interface CompanyGuide {
  slug: string;
  name: string;
  overview: string;
  stages: string[];
  values: string[];
  sourceUrl: string | null;
  sourceLabel: string | null;
}

export const COMPANY_GUIDES: CompanyGuide[] = [
  {
    slug: 'stripe',
    name: 'Stripe',
    overview: 'Known for practical debugging, integration, and collaborative system design rounds.',
    stages: ['Recruiter screen', 'Technical / debugging screen', 'Onsite loop (coding, integration, architecture, behavioral)'],
    values: ['Users first', 'Move with urgency and focus', 'Meticulous craft'],
    sourceUrl: 'https://stripe.com/jobs/university',
    sourceLabel: 'Stripe Careers Guide',
  },
  {
    slug: 'linear',
    name: 'Linear',
    overview: 'Product-minded engineering and design interviews focused on craft, speed, and ownership.',
    stages: ['Introductory call', 'Practical work sample / technical chat', 'Team & founder conversations'],
    values: ['Craft & quality', 'High-agency ownership', 'Clear writing'],
    sourceUrl: null, // Intentionally unverified to follow SPEC.md source rule
    sourceLabel: null,
  },
  {
    slug: 'google',
    name: 'Google',
    overview: 'Structured interviews testing coding, system design (L5+), and Googleyness & leadership.',
    stages: ['Recruiter screen', 'Technical phone screen', 'Onsite loop (4–5 rounds)', 'Team match'],
    values: ['Structured problem solving', 'Collaboration', 'Comfort with ambiguity'],
    sourceUrl: 'https://careers.google.com/how-we-hire/',
    sourceLabel: 'Google Careers — How We Hire',
  },
];

export interface LearnGuide {
  slug: string;
  title: string;
  readTime: string;
  summary: string;
  sections: Array<{ heading: string; body: string }>;
  linkedQuestionId: string;
}

export const LEARN_GUIDES: LearnGuide[] = [
  {
    slug: 'star-method',
    title: 'The STAR Method (Without Sounding Scripted)',
    readTime: '4 min read',
    summary: 'How to structure behavioral answers in 90–150 seconds with clear personal ownership.',
    sections: [
      {
        heading: 'Keep Situation & Task under 25%',
        body: 'Give just enough context so the interviewer understands the stakes, then move immediately to what you personally did.',
      },
      {
        heading: 'Spend 60% on Action ("I", not "we")',
        body: 'Explain the options you weighed, why you chose your path, and how you unblocked obstacles.',
      },
      {
        heading: 'Close with Result + Learning',
        body: 'State the before/after numbers and one sentence on what you would do differently next time.',
      },
    ],
    linkedQuestionId: 'beh-1',
  },
  {
    slug: 'tell-me-about-yourself',
    title: 'The "Tell Me About Yourself" Formula',
    readTime: '3 min read',
    summary: 'Present → Past → Future in 90 seconds, tailored to the job description.',
    sections: [
      {
        heading: 'Present',
        body: 'Start with your current role, scope, and one recent measurable win.',
      },
      {
        heading: 'Past',
        body: 'Highlight 1–2 prior experiences that directly prove you can do the target job.',
      },
      {
        heading: 'Future',
        body: 'Connect your trajectory to why this specific team and role are the logical next step.',
      },
    ],
    linkedQuestionId: 'hr-1',
  },
  {
    slug: 'questions-for-interviewer',
    title: 'High-Signal Questions to Ask the Interviewer',
    readTime: '3 min read',
    summary: 'Turn the last 5 minutes into a genuine two-way evaluation.',
    sections: [
      {
        heading: 'Ask about the first 90 days',
        body: '"What is the biggest bottleneck the person in this role needs to solve in the first 90 days?"',
      },
      {
        heading: 'Ask about trade-offs',
        body: '"What is a technical or product trade-off the team had to make recently, and how did you decide?"',
      },
    ],
    linkedQuestionId: 'hr-3',
  },
];
