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
  {
    slug: 'system-design',
    name: 'System Design',
    description: 'Requirements scoping, capacity estimates, architecture, data modeling, and trade-offs.',
    rubric: [
      { name: 'Requirements & scoping', weight: 15 },
      { name: 'Capacity & scale estimates', weight: 10 },
      { name: 'High-level architecture & APIs', weight: 25 },
      { name: 'Data model & storage choices', weight: 20 },
      { name: 'Deep dives & bottleneck handling', weight: 15 },
      { name: 'Trade-offs & reliability', weight: 15 },
    ],
  },
  {
    slug: 'consulting',
    name: 'Consulting & Case',
    description: 'MECE problem structuring, quantitative case math, exhibit synthesis, and executive recommendations.',
    rubric: [
      { name: 'MECE problem structuring', weight: 25 },
      { name: 'Quantitative accuracy & case math', weight: 25 },
      { name: 'Insight & exhibit synthesis', weight: 20 },
      { name: 'Business judgment & creativity', weight: 15 },
      { name: 'Executive communication', weight: 15 },
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
  {
    id: 'sys-1',
    trackSlug: 'system-design',
    category: 'Distributed Systems',
    text: 'Design a distributed rate limiter that supports per-user and per-IP quotas across multiple regions.',
    whyAsked: 'Evaluates requirements scoping, token/sliding-window algorithms, Redis/atomic counters, and failure modes.',
    followUps: [
      'How do you handle clock skew and race conditions across nodes?',
      'What happens if the rate-limiter store is temporarily unreachable — fail open or fail closed?',
    ],
  },
  {
    id: 'sys-2',
    trackSlug: 'system-design',
    category: 'Data & Scale',
    text: 'Design a scalable URL shortener with custom aliases, click analytics, and 99.99% read availability.',
    whyAsked: 'Tests back-of-the-envelope capacity math, key generation, caching, and read/write path separation.',
    followUps: [
      'How would you partition the database and avoid hot keys?',
      'How would you stream click analytics without slowing down redirects?',
    ],
  },
  {
    id: 'con-1',
    trackSlug: 'consulting',
    category: 'Profitability',
    text: 'A B2B SaaS client saw net margin drop from 22% to 14% despite 12% revenue growth. How would you diagnose and address this?',
    whyAsked: 'Tests MECE profit-tree structuring, unit economics, and disciplined hypothesis testing.',
    followUps: [
      'Which cost buckets would you examine first: COGS, S&M, R&D, or G&A?',
      'If customer acquisition cost rose 35%, what levers would you recommend?',
    ],
  },
  {
    id: 'con-2',
    trackSlug: 'consulting',
    category: 'Market Entry',
    text: 'A European specialty coffee chain is considering entering the US market. Should they enter, and how?',
    whyAsked: 'Assesses market sizing, competitive positioning, channel economics, and go-to-market sequencing.',
    followUps: [
      'How would you size the addressable US specialty coffee market in year one?',
      'What are the biggest operational risks of a flagship-first vs. franchise rollout?',
    ],
  },
];
