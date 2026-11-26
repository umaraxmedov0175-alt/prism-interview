export interface SeedTrack {
  slug: string;
  name: string;
  description: string;
  rubric: Array<{ name: string; weight: number }>;
}

export interface SeedQuestion {
  id: string;
  trackSlug: string;
  category: string;
  text: string;
  whyAsked: string;
  followUps: string[];
}

export const MVP_TRACKS: SeedTrack[] = [
  {
    slug: 'behavioral',
    name: 'Behavioral / Competency',
    description: 'STAR-structured stories covering leadership, conflict, ownership, and impact.',
    rubric: [
      { name: 'Structure / STAR', weight: 20 },
      { name: 'Specificity and evidence', weight: 20 },
      { name: 'Ownership and impact', weight: 20 },
      { name: 'Relevance to question and role', weight: 15 },
      { name: 'Reflection and learning', weight: 10 },
      { name: 'Communication and conciseness', weight: 15 },
    ],
  },
  {
    slug: 'general-hr',
    name: 'General / HR Screen',
    description: 'Tell me about yourself, motivation, strengths, weaknesses, and role fit.',
    rubric: [
      { name: 'Clarity of narrative', weight: 25 },
      { name: 'Role & company motivation', weight: 25 },
      { name: 'Self-awareness', weight: 20 },
      { name: 'Professionalism & tone', weight: 15 },
      { name: 'Questions for interviewer', weight: 15 },
    ],
  },
  {
    slug: 'software-engineering',
    name: 'Software Engineering',
    description: 'Problem solving, debugging, system trade-offs, and technical communication.',
    rubric: [
      { name: 'Problem understanding', weight: 15 },
      { name: 'Approach and trade-offs', weight: 20 },
      { name: 'Correctness', weight: 25 },
      { name: 'Complexity analysis', weight: 10 },
      { name: 'Code quality', weight: 15 },
      { name: 'Communication while coding', weight: 15 },
    ],
  },
];

export const MVP_QUESTIONS: SeedQuestion[] = [
  {
    id: 'beh-1',
    trackSlug: 'behavioral',
    category: 'Conflict',
    text: 'Tell me about a time you disagreed with a teammate or manager. How did you resolve it?',
    whyAsked: 'Evaluates how you navigate disagreement with data, empathy, and ownership.',
    followUps: [
      'What was your specific individual role in resolving it?',
      'What would you do differently next time?',
    ],
  },
  {
    id: 'beh-2',
    trackSlug: 'behavioral',
    category: 'Ownership',
    text: 'Describe a project that missed its deadline or ran into a major blocker. What did you do?',
    whyAsked: 'Tests accountability, prioritization under pressure, and reflection.',
    followUps: [
      'What measurable impact did your recovery steps have?',
      'How did you communicate the risk to stakeholders?',
    ],
  },
  {
    id: 'beh-3',
    trackSlug: 'behavioral',
    category: 'Ambiguity',
    text: 'Tell me about a time you had to make an important decision with incomplete information.',
    whyAsked: 'Measures judgment, structured thinking, and comfort with ambiguity.',
    followUps: [
      'What trade-offs did you weigh?',
      'How did the outcome turn out, and how did you measure it?',
    ],
  },
  {
    id: 'beh-4',
    trackSlug: 'behavioral',
    category: 'Impact',
    text: 'Tell me about your proudest technical or product achievement and why it mattered.',
    whyAsked: 'Checks what bar you hold yourself to and whether you connect work to outcomes.',
    followUps: [
      'What part did you personally own vs. the rest of the team?',
      'What numbers changed after launch?',
    ],
  },
  {
    id: 'hr-1',
    trackSlug: 'general-hr',
    category: 'Background',
    text: 'Tell me about yourself and walk me through why this role makes sense next.',
    whyAsked: 'Assesses narrative clarity and alignment with the target role.',
    followUps: ['Which past project is most relevant to this role?'],
  },
  {
    id: 'hr-2',
    trackSlug: 'general-hr',
    category: 'Self-Awareness',
    text: 'What is one real weakness you are actively working to improve?',
    whyAsked: 'Tests honesty and concrete self-improvement habits.',
    followUps: ['Give a recent example where that showed up.'],
  },
  {
    id: 'hr-3',
    trackSlug: 'general-hr',
    category: 'Motivation',
    text: 'Why are you interested in this company and team specifically?',
    whyAsked: 'Separates genuine preparation from generic applications.',
    followUps: ['What product or engineering challenge excites you most here?'],
  },
  {
    id: 'swe-1',
    trackSlug: 'software-engineering',
    category: 'Backend & Debugging',
    text: 'How would you debug a sudden spike in p95 API latency in production?',
    whyAsked: 'Tests systematic root-cause analysis across metrics, DB, and network.',
    followUps: ['What would you check first in the database?', 'How would you prevent regressions?'],
  },
  {
    id: 'swe-2',
    trackSlug: 'software-engineering',
    category: 'Algorithms & DS',
    text: 'How would you design an LRU Cache with O(1) get and put operations?',
    whyAsked: 'Checks data structure composition (hash map + doubly linked list) and edge cases.',
    followUps: ['What happens when capacity is 0 or 1?', 'What is the space complexity?'],
  },
  {
    id: 'swe-3',
    trackSlug: 'software-engineering',
    category: 'System Trade-offs',
    text: 'Explain idempotency in REST APIs and how you implement it for critical endpoints.',
    whyAsked: 'Tests production reliability thinking and distributed edge cases.',
    followUps: ['How do you handle concurrent duplicate requests?'],
  },
];
