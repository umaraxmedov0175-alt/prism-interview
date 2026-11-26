import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const COMPETENCIES = [
  { slug: 'leadership', name: 'Leadership', description: 'Guiding teams, setting direction, and taking responsibility.' },
  { slug: 'conflict-resolution', name: 'Conflict Resolution', description: 'Navigating disagreement constructively.' },
  { slug: 'ownership', name: 'Ownership & Impact', description: 'Taking end-to-end accountability and driving measurable results.' },
  { slug: 'ambiguity', name: 'Navigating Ambiguity', description: 'Making sound decisions with incomplete information.' },
  { slug: 'communication', name: 'Communication', description: 'Clear, structured, and concise explanation.' },
  { slug: 'customer-focus', name: 'Customer Focus', description: 'Prioritizing user needs and outcomes.' },
  { slug: 'problem-solving', name: 'Problem Solving', description: 'Breaking down complex technical or business problems.' },
  { slug: 'algorithms', name: 'Algorithms & Data Structures', description: 'Designing optimal algorithms and analyzing complexity.' },
  { slug: 'system-thinking', name: 'System Thinking', description: 'Understanding architecture, trade-offs, and reliability.' },
  { slug: 'adaptability', name: 'Adaptability & Learning', description: 'Reflecting on failures and improving.' },
];

const FORMATS = [
  {
    slug: 'one-on-one-video',
    name: 'One-on-One Video',
    description: 'Voice + optional webcam with one interviewer persona.',
    config: { camera_optional: true, personas: 1, max_answer_seconds: 150 },
  },
  {
    slug: 'phone-hr-screen',
    name: 'Phone / HR Screen',
    description: 'Voice only, no camera, 15-20 min recruiter persona.',
    config: { camera_optional: false, personas: 1, max_answer_seconds: 120 },
  },
  {
    slug: 'live-technical',
    name: 'Live Technical',
    description: 'Voice + code editor or whiteboard side by side.',
    config: { camera_optional: true, personas: 1, max_answer_seconds: 300, has_editor: true },
  },
  {
    slug: 'stress-curveball',
    name: 'Stress / Curveball',
    description: 'Skeptical follow-ups and tighter time pressure (opt-in).',
    config: { camera_optional: true, personas: 1, max_answer_seconds: 90, skeptical: true },
  },
];

const TRACKS = [
  {
    slug: 'behavioral',
    name: 'Behavioral / Competency',
    description: 'STAR-structured stories covering leadership, conflict, ownership, failure, and impact.',
    tools: ['star_checker'],
    is_mvp: true,
  },
  {
    slug: 'general-hr',
    name: 'General / HR Screen',
    description: 'Tell me about yourself, motivation, strengths, weaknesses, and role fit.',
    tools: [],
    is_mvp: true,
  },
  {
    slug: 'software-engineering',
    name: 'Software Engineering',
    description: 'Data structures, algorithms, debugging, code quality, and engineering trade-offs.',
    tools: ['code_editor'],
    is_mvp: true,
  },
];

const RUBRICS = [
  {
    slug: 'behavioral-default',
    track_slug: 'behavioral',
    dimensions: [
      {
        name: 'Structure / STAR',
        weight: 20,
        descriptors: {
          1: 'No clear structure; rambling or fragmented.',
          2: 'Partial story; missing Situation/Task or Result.',
          3: 'Follows STAR loosely; transitions are uneven.',
          4: 'Clear Situation, Task, Action, and Result.',
          5: 'Crisp, well-paced STAR story with clear takeaways.',
        },
      },
      {
        name: 'Specificity and evidence',
        weight: 20,
        descriptors: {
          1: 'No example; purely hypothetical.',
          2: 'General example with no concrete details.',
          3: 'Real example with few specific details.',
          4: 'Real example with names, actions, and at least one number.',
          5: 'Clear example with numbers, own actions, and measured outcome.',
        },
      },
      {
        name: 'Ownership and impact',
        weight: 20,
        descriptors: {
          1: 'Blames others or speaks only in "we" without personal role.',
          2: 'Passive role; unclear what the candidate personally drove.',
          3: 'Identifies own task, moderate impact.',
          4: 'Clear personal ownership and meaningful team/product impact.',
          5: 'High agency, drove outcome end-to-end with verified impact.',
        },
      },
      {
        name: 'Relevance to question and role',
        weight: 15,
        descriptors: {
          1: 'Off-topic answer.',
          2: 'Tangentially related to the prompt.',
          3: 'Answers the prompt at a basic level.',
          4: 'Directly addresses the prompt and role expectations.',
          5: 'Tailored to both the prompt and target seniority.',
        },
      },
      {
        name: 'Reflection and learning',
        weight: 10,
        descriptors: {
          1: 'No reflection.',
          2: 'Surface-level takeaway.',
          3: 'Mentions one lesson learned.',
          4: 'Honest reflection on what could be improved.',
          5: 'Deep self-awareness and concrete behavior change afterward.',
        },
      },
      {
        name: 'Communication and conciseness',
        weight: 15,
        descriptors: {
          1: 'Hard to follow; excessive filler or tangents.',
          2: 'Too long or too brief; key points buried.',
          3: 'Understandable with minor pacing issues.',
          4: 'Clear, direct, and well-paced.',
          5: 'Executive-level clarity; every sentence earns its place.',
        },
      },
    ],
  },
  {
    slug: 'general-hr-default',
    track_slug: 'general-hr',
    dimensions: [
      {
        name: 'Clarity of narrative',
        weight: 25,
        descriptors: {
          1: 'Unfocused career story.',
          2: 'Chronological list without thread.',
          3: 'Clear background with minor gaps.',
          4: 'Cohesive narrative connecting past to target role.',
          5: 'Compelling, concise narrative tailored to the company.',
        },
      },
      {
        name: 'Role & company motivation',
        weight: 25,
        descriptors: {
          1: 'Generic answer applicable to any company.',
          2: 'Mentions surface facts without personal fit.',
          3: 'Reasonable alignment with role.',
          4: 'Specific reasons grounded in product, team, or mission.',
          5: 'Deep, authentic alignment backed by preparation.',
        },
      },
      {
        name: 'Self-awareness',
        weight: 20,
        descriptors: {
          1: 'Avoids weaknesses or gives cliché answers.',
          2: 'Vague self-assessment.',
          3: 'Honest strengths and one real area of growth.',
          4: 'Balanced view with concrete steps to improve.',
          5: 'High maturity and calibrated self-awareness.',
        },
      },
      {
        name: 'Professionalism & tone',
        weight: 15,
        descriptors: {
          1: 'Defensive or negative about past employers.',
          2: 'Flat or overly casual.',
          3: 'Polite and professional.',
          4: 'Warm, confident, and composed.',
          5: 'Engaging, poised, and collaborative.',
        },
      },
      {
        name: 'Questions for interviewer',
        weight: 15,
        descriptors: {
          1: 'No questions asked.',
          2: 'Basic questions easily found on the website.',
          3: 'Standard role/team questions.',
          4: 'Thoughtful questions about priorities and challenges.',
          5: 'Insightful questions showing strategic thinking.',
        },
      },
    ],
  },
  {
    slug: 'software-engineering-default',
    track_slug: 'software-engineering',
    dimensions: [
      {
        name: 'Problem understanding',
        weight: 15,
        descriptors: {
          1: 'Jumps into coding without clarifying requirements.',
          2: 'Misses key constraints or edge cases.',
          3: 'Clarifies basic inputs and outputs.',
          4: 'Asks targeted questions on constraints and edge cases.',
          5: 'Systematic requirement gathering before designing.',
        },
      },
      {
        name: 'Approach and trade-offs',
        weight: 20,
        descriptors: {
          1: 'No coherent strategy.',
          2: 'Brute force only without considering alternatives.',
          3: 'Working approach with limited trade-off discussion.',
          4: 'Compares approaches and picks a sound solution.',
          5: 'Optimal approach with crisp trade-off analysis.',
        },
      },
      {
        name: 'Correctness',
        weight: 25,
        descriptors: {
          1: 'Fails core cases.',
          2: 'Works on happy path, breaks on edge cases.',
          3: 'Mostly correct with minor bugs.',
          4: 'Handles main and edge cases cleanly.',
          5: 'Bug-free, verified with dry runs and edge cases.',
        },
      },
      {
        name: 'Complexity analysis',
        weight: 10,
        descriptors: {
          1: 'Unable to state time/space complexity.',
          2: 'Incorrect Big-O analysis.',
          3: 'States time complexity accurately.',
          4: 'Accurate time and space complexity.',
          5: 'Tight Big-O analysis including amortized/worst-case.',
        },
      },
      {
        name: 'Code quality',
        weight: 15,
        descriptors: {
          1: 'Unreadable or poorly structured.',
          2: 'Messy naming and duplicated logic.',
          3: 'Readable with minor style issues.',
          4: 'Clean, modular, idiomatic code.',
          5: 'Production-grade clarity and modularity.',
        },
      },
      {
        name: 'Communication while coding',
        weight: 15,
        descriptors: {
          1: 'Silent for long stretches.',
          2: 'Sporadic narration.',
          3: 'Explains steps when prompted.',
          4: 'Thinks aloud clearly while writing.',
          5: 'Collaborative, structured narration throughout.',
        },
      },
    ],
  },
];

function buildQuestionsForTrack(
  trackSlug: string,
  trackId: string,
  prompts: Array<{ text: string; category: string; competencies: string[]; difficulty: 'easy' | 'medium' | 'hard'; why_asked: string }>
) {
  return prompts.map((p, idx) => ({
    slug: `${trackSlug}-${idx + 1}`,
    track_id: trackId,
    text: p.text,
    category: p.category,
    competencies: p.competencies,
    level_min: 'intern',
    level_max: 'executive',
    difficulty: p.difficulty,
    why_asked: p.why_asked,
    strong_answer_points: [
      'Clear context and personal ownership ("I" vs "we")',
      'Concrete actions taken and trade-offs considered',
      'Measurable outcome or clear lesson learned',
    ],
    common_mistakes: [
      'Speaking in hypotheticals instead of a real past example',
      'Skipping the measurable result or personal contribution',
    ],
    follow_ups: [
      'What was your specific individual role in that outcome?',
      'What would you do differently if you faced that situation again?',
    ],
    is_public: true,
  }));
}

const BEHAVIORAL_PROMPTS = [
  'Tell me about a time you disagreed with a teammate or manager. How did you resolve it?',
  'Describe a project that failed or missed its deadline. What was your role and what did you learn?',
  'Tell me about a time you had to make a decision with incomplete information.',
  'Give an example of when you took ownership of a problem outside your job description.',
  'Describe a time you had to influence someone without formal authority.',
  'Tell me about your proudest professional achievement and why it mattered.',
  'Describe a time you received tough feedback. How did you react?',
  'Tell me about a situation where priorities shifted suddenly. How did you adapt?',
  'Give an example of a time you simplified a complex process or system.',
  'Tell me about a time you mentored or helped a colleague grow.',
  'Describe a conflict between speed and quality. How did you decide?',
  'Tell me about a time you identified a risk early and prevented a larger issue.',
  'Give an example of when you had to say no to a stakeholder.',
  'Describe a time you made a mistake in front of others. How did you handle it?',
  'Tell me about a goal you set that was especially challenging to reach.',
  'Describe a time you worked with a difficult stakeholder or client.',
  'Tell me about a time data changed your mind on an important decision.',
  'Give an example of when you had to learn a completely new skill quickly.',
  'Describe a time you improved team morale or collaboration.',
  'Tell me about a time you had to deliver bad news.',
  'Give an example of when you advocated for the user or customer.',
  'Describe a project where you had to coordinate across multiple teams.',
  'Tell me about a time you spotted an inefficiency nobody else noticed.',
  'Describe a situation where you had to persuade leadership to change direction.',
  'Tell me about a time you had to debug a messy people or process problem.',
  'Give an example of when you balanced competing deadlines.',
  'Describe a time you took a calculated risk that paid off.',
  'Tell me about a time a calculated risk did not pay off.',
  'Describe a time you had to onboard quickly onto an unfamiliar project.',
  'Tell me about a time you resolved ambiguity for your team.',
  'Give an example of when you pushed back on a requirement.',
  'Describe a time you had to build trust with a new team or client.',
  'Tell me about a time you automated or eliminated repetitive work.',
  'Describe a situation where you had to uphold a high standard under pressure.',
  'Tell me about a time you had to compromise to move a project forward.',
  'Give an example of when you turned around an underperforming project.',
  'Describe a time you had to handle an ethical or policy grey area.',
  'Tell me about a time you anticipated a customer need before they asked.',
  'Describe a time you led a project from zero to launch.',
  'Tell me about a time you had to let go of an idea you were attached to.',
  'Give an example of when you gave difficult feedback to a peer.',
  'Describe a time you recovered from a major setback.',
  'Tell me about a time you had to align two teams with conflicting goals.',
  'Describe a situation where you went above and beyond for a deliverable.',
  'Tell me about a time you noticed a metric going the wrong way and investigated.',
  'Give an example of when you had to document or hand off critical work.',
  'Describe a time you handled an urgent production or customer escalation.',
  'Tell me about a time you challenged the status quo.',
  'Describe a time you worked effectively with someone very different from you.',
  'Tell me about a time you had to cut scope to ship on time.',
].map((text, i) => ({
  text,
  category: i % 5 === 0 ? 'Conflict' : i % 5 === 1 ? 'Ownership' : i % 5 === 2 ? 'Leadership' : i % 5 === 3 ? 'Ambiguity' : 'Failure & Learning',
  competencies: ['ownership', 'communication', i % 2 === 0 ? 'leadership' : 'conflict-resolution'],
  difficulty: (i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
  why_asked: 'Evaluates past behavior as a predictor of future performance using concrete, verifiable actions.',
}));

const GENERAL_HR_PROMPTS = [
  'Tell me about yourself and walk me through your background.',
  'Why are you interested in this role?',
  'Why do you want to work at this company specifically?',
  'Why are you leaving your current role or looking for a new opportunity?',
  'What are your greatest strengths, and how have they helped you recently?',
  'What is one real weakness you are actively working to improve?',
  'Where do you see your career heading over the next 2 to 3 years?',
  'What are your salary expectations for this role?',
  'What kind of work environment brings out your best work?',
  'Tell me about a gap or transition in your resume.',
  'What motivates you to do your best work?',
  'How do you prefer to be managed?',
  'What does success look like in your first 90 days here?',
  'What do you know about our product and customers?',
  'What makes you a stronger fit than other candidates for this role?',
  'Describe your ideal team culture.',
  'How do you handle stress and tight deadlines?',
  'What is the most important thing you look for in your next role?',
  'Tell me about a time you felt proud of your work ethic.',
  'How do you stay current in your field?',
  'What kind of problems do you enjoy solving most?',
  'Describe a manager who brought out your best performance.',
  'What would your previous teammates say is your superpower?',
  'What would your previous manager say you need to work on?',
  'How do you prioritize your day when everything feels urgent?',
  'Are you interviewing with other companies, and what stage are you at?',
  'What is your notice period or availability to start?',
  'Tell me about a project that best represents your skills.',
  'How do you handle repetitive or operational tasks?',
  'What is a common misconception people have about you?',
  'Describe how you collaborate with cross-functional partners.',
  'What kind of feedback do you find most helpful?',
  'Tell me about a career decision you are glad you made.',
  'What would make you turn down an offer?',
  'How do you approach remote or hybrid collaboration?',
  'What tools or workflows make you most productive?',
  'Tell me about a time you had to learn from someone junior to you.',
  'How do you measure your own performance?',
  'What excites you most about our industry right now?',
  'What concerns you most about this role?',
  'How do you handle constructive criticism?',
  'Describe a time you had to pitch yourself or your work.',
  'What is one professional habit you swear by?',
  'How do you balance independent work vs. teamwork?',
  'Tell me about a time you had to step outside your comfort zone.',
  'What kind of impact do you want to make this year?',
  'How do you prepare before starting a new role?',
  'What questions do you have for me about the team or role?',
  'Why this seniority level right now?',
  'Is there anything important about your background we have not covered?',
].map((text, i) => ({
  text,
  category: i % 4 === 0 ? 'Background' : i % 4 === 1 ? 'Motivation' : i % 4 === 2 ? 'Self-Awareness' : 'Logistics & Fit',
  competencies: ['communication', 'adaptability'],
  difficulty: (i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
  why_asked: 'Assesses clarity of career narrative, genuine motivation, self-awareness, and role alignment.',
}));

const SWE_PROMPTS = [
  'Given an array of integers and a target, return indices of the two numbers that add up to target.',
  'Implement an LRU Cache with O(1) get and put operations.',
  'Given a string, find the length of the longest substring without repeating characters.',
  'Merge k sorted linked lists and return it as one sorted list.',
  'Validate whether a binary tree is a valid Binary Search Tree.',
  'Given an array of intervals, merge all overlapping intervals.',
  'Design a rate limiter for an API gateway. What algorithms would you compare?',
  'Explain how you would debug a sudden spike in p99 API latency in production.',
  'Given a 2D grid of 1s and 0s, count the number of islands.',
  'Implement a trie (prefix tree) with insert, search, and startsWith.',
  'Find the kth largest element in an unsorted array without sorting the whole array.',
  'Detect if a linked list has a cycle and return the node where the cycle begins.',
  'Given a directed graph of course prerequisites, determine if all courses can be finished.',
  'Explain the trade-offs between SQL and NoSQL for a high-write event log.',
  'How does database indexing work under the hood, and when can an index hurt writes?',
  'Design a URL shortener service covering API, schema, and collision handling.',
  'Implement binary search on a rotated sorted array.',
  'Given a list of daily temperatures, return how many days until a warmer temperature.',
  'Serialize and deserialize a binary tree.',
  'Explain idempotency in REST APIs and how you implement it for payment endpoints.',
  'Find the lowest common ancestor of two nodes in a binary tree.',
  'Given an integer array, return all unique triplets that sum to zero.',
  'How do you prevent N+1 queries in an ORM-backed API?',
  'Implement a thread-safe or async task queue with concurrency limits.',
  'Explain the difference between optimistic and pessimistic locking with an example.',
  'Find the median of two sorted arrays in logarithmic time.',
  'Design a notification system supporting email, push, and in-app delivery.',
  'Given a matrix, return all elements in spiral order.',
  'Explain how HTTP caching headers (ETag, Cache-Control) work.',
  'Implement debounce and throttle from scratch and explain when to use each.',
  'Find the minimum window substring containing all characters of a pattern.',
  'How do you structure error handling and retries for flaky third-party APIs?',
  'Clone a connected undirected graph.',
  'Explain how TLS handshakes and JWT verification work.',
  'Given a stream of integers, find the running median.',
  'How would you safely migrate a live database column with zero downtime?',
  'Implement a min-stack that supports push, pop, top, and getMin in O(1).',
  'Explain eventual consistency vs. strong consistency with a real example.',
  'Evaluate Reverse Polish Notation using a stack.',
  'How do you profile and fix a memory leak in a Node.js or browser app?',
  'Word break: determine if a string can be segmented into dictionary words.',
  'Explain what happens from the moment a user presses Enter on a URL in a browser.',
  'Find the longest palindromic substring in a given string.',
  'How do you design pagination for a fast-changing feed: offset vs. cursor?',
  'Coin change: compute the fewest number of coins needed to make up an amount.',
  'What do you look for first when reviewing a teammate’s pull request?',
  'Koko eating bananas: find the minimum integer eating speed using binary search on answer.',
  'Explain deadlocks, the four conditions for one, and how to prevent them.',
  'Top K frequent elements in an integer array.',
  'How do you test an endpoint that depends on an LLM or external webhook?',
].map((text, i) => ({
  text,
  category: i % 3 === 0 ? 'Algorithms & DS' : i % 3 === 1 ? 'Debugging & Backend' : 'System & Code Quality',
  competencies: ['problem-solving', 'algorithms', 'system-thinking'],
  difficulty: (i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard') as 'easy' | 'medium' | 'hard',
  why_asked: 'Tests problem decomposition, algorithmic trade-offs, correctness, and clear technical communication.',
}));

async function main() {
  console.log('Seeding competencies...');
  const { error: compErr } = await supabase
    .from('competencies')
    .upsert(COMPETENCIES, { onConflict: 'slug' });
  if (compErr) throw compErr;

  console.log('Seeding formats...');
  const { error: fmtErr } = await supabase
    .from('formats')
    .upsert(FORMATS, { onConflict: 'slug' });
  if (fmtErr) throw fmtErr;

  console.log('Seeding tracks...');
  const { data: trackRows, error: trkErr } = await supabase
    .from('tracks')
    .upsert(TRACKS, { onConflict: 'slug' })
    .select('id, slug');
  if (trkErr) throw trkErr;

  const trackBySlug = new Map(trackRows.map((t) => [t.slug, t.id]));

  console.log('Seeding rubrics...');
  for (const rubric of RUBRICS) {
    const trackId = trackBySlug.get(rubric.track_slug);
    const { data: rubricRow, error: rubErr } = await supabase
      .from('rubrics')
      .upsert(
        {
          slug: rubric.slug,
          track_id: trackId,
          dimensions: rubric.dimensions,
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();
    if (rubErr) throw rubErr;

    if (trackId && rubricRow) {
      await supabase
        .from('tracks')
        .update({ rubric_id: rubricRow.id })
        .eq('id', trackId);
    }
  }

  console.log('Seeding 150 MVP questions (50 per MVP track)...');
  const allQuestions = [
    ...buildQuestionsForTrack('behavioral', trackBySlug.get('behavioral')!, BEHAVIORAL_PROMPTS),
    ...buildQuestionsForTrack('general-hr', trackBySlug.get('general-hr')!, GENERAL_HR_PROMPTS),
    ...buildQuestionsForTrack('software-engineering', trackBySlug.get('software-engineering')!, SWE_PROMPTS),
  ];

  const { error: qErr } = await supabase
    .from('questions')
    .upsert(allQuestions, { onConflict: 'slug' });
  if (qErr) throw qErr;

  console.log(`Seed complete: ${COMPETENCIES.length} competencies, ${FORMATS.length} formats, ${TRACKS.length} tracks, ${RUBRICS.length} rubrics, ${allQuestions.length} questions.`);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
