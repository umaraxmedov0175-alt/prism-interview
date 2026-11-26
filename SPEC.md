# Prism: Interview — Full Build Plan

**One-line pitch:** Practice the exact interview you are about to face, with an AI interviewer that listens, pushes back, and tells you precisely what to fix.

**Hard product rule:** No live-interview copilot, no stealth mode, no hidden answer overlay during real interviews. Prism: Interview trains the person; it never answers for them in a real interview.

---

## 1. Product overview

Build **Prism: Interview**: one web platform that prepares a person for any interview, from a first HR screen to a FAANG system design round, a consulting case, a college admissions interview or a visa interview. The core is a realistic AI interviewer that talks by voice, asks follow-ups, and grades every answer against a published rubric.

### Target users

| Segment | What they need | Interview types they face |
| :--- | :--- | :--- |
| Job seekers (all fields) | Behavioral + role questions, delivery feedback | HR screen, behavioral, panel, one-way video |
| Software engineers | Coding, system design, behavioral | Live coding, system design, OOD, behavioral |
| PM, data, design candidates | Product sense, metrics, SQL, portfolio | PM, analytics, SQL, portfolio review |
| Consulting and finance | Case math, structure, technicals | Case, market sizing, IB technicals, fit |
| Students | University and scholarship interviews | Admissions, alumni, scholarship, visa |
| Career centers and bootcamps (B2B) | Cohort dashboards, assignments | All of the above |

**Positioning:** Competitors each own one slice: delivery coaching, tech mocks, a video course library, or a live-interview copilot. Prism: Interview combines content quality, delivery analytics, and role-specific technical rounds in one place, and it stays an honest practice tool.

---

## 2. Market research & differentiation

**Table stakes:** Role and company question banks, AI mock interview, transcript, post-session report, progress tracking, resume or job-description tailoring.

**Where Prism: Interview wins:**
1. **Content + delivery + technical in one session.** Score what was said (rubric), how it was said (speech metrics), and the technical work (code, diagram, case math).
2. **Adaptive follow-ups.** The interviewer digs into weak spots like a real one ("What was your specific role?", "What would you do differently?").
3. **Story Bank.** The user's real experiences, mapped to competencies, reused across questions. No invented stories.
4. **Interview Plan.** Paste a job description and interview date; get a day-by-day plan to that date.
5. **Honest by design.** Practice only; the AI never writes answers the user will read aloud in a real interview.

---

## 3. Interview coverage

Every mock session is defined by two choices: a **track** (what is tested) and a **format** (how it is delivered). Build both as data, so new tracks and formats are added without code changes.

### 3.1 Formats (how the interview runs)
- **Phone / HR screen:** Voice only, no camera, 15–20 min, recruiter persona
- **One-on-one video:** Voice + webcam, one interviewer persona
- **Panel:** 2–4 interviewer personas with different voices and focus areas, taking turns
- **One-way recorded (HireVue style):** Question shown, 30 s thinking timer, 1–3 min answer timer, optional single attempt
- **Live technical:** Voice + code editor or whiteboard side by side
- **Case interview:** Interviewer-led or candidate-led case, exhibits shown on screen, scratchpad for math
- **Group / assessment centre:** Group discussion with 3 AI candidates, in-tray exercise, presentation task
- **Stress / curveball:** Interruptions, skeptical follow-ups, time pressure (opt-in)
- **Final round / onsite loop:** 3–5 back-to-back rounds with one combined report

### 3.2 Tracks (what is tested)
- General / HR
- Behavioral / competency (Special tool: STAR checker)
- Situational
- Software engineering (Special tool: Code editor + runner)
- System design (Special tool: Whiteboard)
- Frontend / mobile / ML / data engineering (Special tool: Code editor)
- Data science / analytics (Special tool: SQL sandbox)
- Product management (Special tool: Whiteboard)
- Design (UX/UI) (Special tool: Slide upload)
- Consulting (Special tool: Case scratchpad)
- Finance / banking
- Sales / customer success (Special tool: Role-play persona)
- Healthcare / teaching / public sector (Special tool: Station timer)
- Leadership / management
- Students (University admissions, alumni, scholarship interviews)
- Visa / immigration
- Entry level / internship
- Salary negotiation (Special tool: Role-play persona)

### 3.3 Seniority and language
- **Levels:** `intern`, `junior`, `mid`, `senior`, `staff/lead`, `manager`, `executive`. Level changes question depth and grading bar.
- **Interview languages:** English first; add Uzbek, Russian and others through the same voice model (the Live API supports 70 languages). The UI language is separate from the interview language.

---

## 4. Feature specification

Twelve modules. Modules 4.1 to 4.6 are the MVP; the rest come in later phases (Section 10).

### 4.1 Onboarding and profile
- Sign up with Google or email (magic link). No passwords stored.
- 5-step onboarding: target role, seniority, target companies (optional), interview date (optional), resume upload (PDF/DOCX, optional).
- Resume is parsed by AI into structured experience items; user confirms or edits each item.
- Mic and camera check screen with live level meter and preview before the first session.

### 4.2 AI Mock Interview (the core)
- **Session setup screen:** track, format, level, company (optional), job description paste (optional), length (10 / 20 / 30 / 45 / 60 min), difficulty (warm-up / realistic / tough), interviewer persona (friendly, neutral, skeptical), camera on/off.
- **During the session:**
  - Real-time voice conversation with the AI interviewer; user can interrupt it (barge-in).
  - Live captions of both sides; toggle to hide them for realism.
  - Interviewer avatar with speaking animation (abstract animated orb or initials card, no fake human faces).
  - Adaptive follow-ups: if an answer misses Result or ownership, the interviewer asks for it, as a real interviewer would. Max 2 follow-ups per question.
  - Side panel by track: code editor, whiteboard, SQL sandbox, case scratchpad, or exhibit viewer.
  - Timer, question counter, "repeat question", "I need a moment" (pauses 30 s), "end interview".
  - Text-input fallback when mic is unavailable.
  - Optional recording of user video and audio (stored privately, user can delete).
- **Interview structure:** greeting and small talk → short intro of the role → main questions → follow-ups → "Do you have questions for me?" (grade the user's questions too) → closing.

### 4.3 Feedback report
Generated within 60 seconds of session end.
- **Overall score** 0–100 and a hire signal: `Strong no` / `No` / `Lean no` / `Lean yes` / `Yes` / `Strong yes`.
- **Rubric scores** 1–5 per dimension (Section 9), each with one sentence of evidence quoted from the transcript.
- **Per-question breakdown:** question, user's transcript, score, what worked, what was missing, a stronger structure outline (bullets only, built from the user's own facts; never a full scripted answer).
- **Delivery metrics:** words per minute (target 130–160), filler words with count and list, longest pause, average answer length vs. recommended (behavioral 1.5–2.5 min), hedging words ("I think", "maybe", "kind of"), talk-to-listen ratio, eye contact % (if camera on, via on-device face landmarks).
- **Content metrics:** STAR completeness per behavioral answer, role keywords covered from the job description, specificity (numbers, names, outcomes), "I" vs "we" balance.
- **Top 3 fixes** ranked by impact, each linked to a drill.
- **Replay:** video/audio player synced to the transcript; click a sentence to jump; filler words highlighted.
- Export report as PDF; share a read-only link (off by default).

### 4.4 Question Bank
- 3,000+ questions at launch, tagged by track, category, competency, level, company, and difficulty.
- Filters, search, "most asked this month", save to list.
- Each question page: why interviewers ask it, what a strong answer covers, common mistakes, rubric, "practice this question" button (single-question drill, 2–5 min).
- Company pages: interview process stages, typical rounds, values/frameworks, tagged questions. Only facts with a cited source; mark unverified data clearly.

### 4.5 Story Bank (STAR builder)
- User writes real stories in guided fields: Situation, Task, Action, Result, Learning, plus metrics.
- AI asks clarifying questions to pull out missing facts; it does not invent facts.
- Each story is tagged with the competencies it proves; a coverage grid shows which competencies have no story yet.
- During mocks, the report shows which story the user used and whether a better one existed.

### 4.6 Progress dashboard
- Readiness score per track (weighted average of last 5 sessions).
- Trend lines: overall score, filler words per minute, WPM, STAR completeness.
- Weakest 3 competencies with recommended drills.
- Streak, weekly goal (e.g. 3 sessions), session history table.

### 4.7–4.12 Later Phases
- **4.7 Interview Plan:** Job description + interview date + hours/day → day-by-day plan recalculated after every session.
- **4.8 Coding round:** Monaco editor (Python, JS/TS, Java, C++, Go), sandbox runner (Judge0 or Piston), visible + hidden test cases.
- **4.9 System design & whiteboard round:** Excalidraw whiteboard read as image every 60 s and on request.
- **4.10 Case interview round:** Case library, exhibits, scratchpad + calculator.
- **4.11 Learn hub:** Short written guides with diagrams + linked drills.
- **4.12 Extras:** Peer mock (WebRTC), expert coaching marketplace (Stripe), resume/JD match, thank-you email helper, B2B dashboard, PWA/mobile.

---

## 5. Site map, pages and user flows

### 5.1 Public pages (marketing, SEO)
- `/` — Hero with live demo clip of a mock, "Start free mock" CTA, track grid, how-it-works (3 steps), sample report preview, comparison table, pricing teaser, FAQ, footer
- `/tracks/[track]` — Track landing page
- `/questions` and `/questions/[slug]` — Public question bank (SEO)
- `/companies/[slug]` — Company interview guide
- `/learn` and `/learn/[slug]` — Guides
- `/pricing` — Plans
- `/for-teams` — B2B page
- `/about`, `/privacy`, `/terms`, `/contact` — Legal and company pages

### 5.2 App pages (signed in)
- `/onboarding` — 5-step setup
- `/app` — Dashboard
- `/app/practice/new` — Session setup
- `/app/practice/[id]/check` — Device check
- `/app/practice/[id]/live` — Live interview room
- `/app/reports` and `/app/reports/[id]` — Reports
- `/app/drills` — Single-question drills
- `/app/stories` — Story Bank and competency coverage grid
- `/app/plan` — Interview Plan
- `/app/questions` — Question bank with saved lists
- `/app/progress` — Charts and history
- `/app/settings` — Profile, resume, language, voice, privacy, billing
- `/admin` — Content admin

### 5.3 Core user flow (first session in under 3 minutes)
1. Land on `/`, click "Start free mock".
2. Sign in with Google.
3. Pick role and level (2 clicks); skip the rest of onboarding.
4. Device check passes.
5. 10-minute behavioral mock with 3 questions.
6. Report appears; user sees the top 3 fixes.
7. Prompt: "Retry question 2 with the fix" → drill → score change shown side by side.
8. Prompt to add an interview date → Interview Plan created.

### 5.4 Pricing
- **Free ($0):** 3 mock sessions/month (max 15 min), full question bank, basic report
- **Pro (~$19/month or $99/year):** Unlimited mocks, all tracks, coding/whiteboard/case rooms, full reports, replay, Interview Plan
- **Teams (per seat):** Cohort dashboard, assignments, custom question sets

---

## 6. Design system

The look is calm, precise and serious, close to Linear, Stripe and Vercel: lots of white space, one accent color, sharp typography, no stock photos of handshakes.

### 6.1 Color tokens (light and dark mode both required)

| Token | Light | Dark | Use |
| :--- | :--- | :--- | :--- |
| `--bg` | `#FFFFFF` | `#0B0D12` | Page background |
| `--surface` | `#F7F8FA` | `#12151C` | Cards, panels |
| `--border` | `#E6E8EC` | `#232834` | Dividers, card borders |
| `--text` | `#0F172A` | `#E7EAF0` | Main text |
| `--text-muted` | `#5B6475` | `#8B94A7` | Secondary text |
| `--primary` | `#4F46E5` | `#7C74FF` | Buttons, links, focus ring (indigo) |
| `--success` | `#16A34A` | `#22C55E` | Good scores |
| `--warning` | `#D97706` | `#F59E0B` | Medium scores |
| `--danger` | `#DC2626` | `#EF4444` | Low scores, recording dot |

Score color scale: 1–2 danger, 3 warning, 4–5 success. Never use color alone; always show the number.

### 6.2 Typography
- UI and body: **Inter** (variable), 15 px base, line height 1.6.
- Headings: **Inter Display** or **Geist**, weights 600–700, tight letter spacing (-0.02em).
- Code and metrics: **JetBrains Mono** or **Geist Mono**.
- Scale: 12 / 14 / 15 / 18 / 24 / 32 / 48 / 64 px.

### 6.3 Layout and components
- 8 px spacing grid; max content width 1200 px; app uses a left sidebar (collapsible) + top bar.
- Radius: 8 px for inputs and buttons, 12 px for cards, 999 px for pills.
- shadcn/ui (Radix based): Button, Card, Dialog, Sheet, Tabs, Select, Command palette (Cmd+K), Toast, Tooltip, Progress, Badge, Table, Skeleton.
- Custom components: `InterviewerOrb`, `LiveCaption`, `ScoreRing`, `RubricBar`, `TranscriptLine`, `MetricTile`, `CompetencyGrid`, `SessionTimer`, `RecordingBadge`.
- Charts: Recharts or Tremor; same palette tokens.

### 6.4 Motion & Quality bar
- Framer Motion; durations 150–250 ms, ease-out. Page transitions as subtle fades only. Respect `prefers-reduced-motion`.
- `InterviewerOrb` pulses with real audio amplitude (Web Audio `AnalyserNode`).
- WCAG 2.1 AA: contrast 4.5:1, full keyboard use, visible focus ring, aria labels on all icon buttons, captions on by default.
- Lighthouse 90+ on Performance, Accessibility, Best Practices, SEO for public pages.
- Every async screen has loading skeleton, empty state, and error state with a retry button.
- Fully responsive from 360 px.

---

## 7. Tech stack and architecture

- **Framework:** Next.js (App Router), React, TypeScript strict
- **UI:** Tailwind CSS, shadcn/ui, Radix, Framer Motion, lucide-react
- **Database, auth, files:** Supabase (Postgres + RLS, Auth Google + magic link, Storage, pgvector)
- **Voice AI:** Gemini Live API (`gemini-3.8-live`), browser connects with server-minted ephemeral tokens
- **Text AI:** Gemini text model (`gemini-4-hydrogen`) via `@google/genai`, JSON output validated by Zod
- **Search:** pgvector embeddings on questions
- **Background jobs:** Inngest (or Supabase Edge Functions + queue)
- **Code runner:** Judge0 or Piston
- **Editors:** Monaco (code), Excalidraw (whiteboard)
- **Vision:** MediaPipe Face Landmarker (in browser, on-device)
- **Payments:** Stripe Checkout + Customer Portal + webhooks
- **Email:** Resend + React Email
- **Analytics, errors:** PostHog, Sentry
- **Tests:** Vitest, Playwright

---

## 8. Database schema

All tables have `id uuid pk`, `created_at`, `updated_at`. User-owned tables have `user_id` and RLS.

Tables:
- `profiles`, `resumes`, `experiences`, `stories`
- `tracks`, `formats`, `competencies`, `companies`, `questions` (`embedding vector(768)`), `coding_problems`, `cases`, `rubrics`
- `sessions`, `session_turns`, `session_artifacts`, `reports`, `drills`, `plans`, `saved_lists`, `subscriptions`, `usage_events`
- B2B phase: `teams`, `team_members`, `assignments`

Storage buckets (private): `resumes`, `recordings`, `artifacts`. Signed URLs only, 1-hour expiry. Recordings auto-delete after 90 days unless pinned.

---

## 9. AI interviewer prompts, rubrics, and delivery metrics

- Store prompts in `/lib/ai/prompts/*.ts` as versioned templates. Save `model_version` and `prompt_version` on every report.
- Validate grader output with Zod; on invalid JSON retry once, then mark report `failed` with retry button.
- Delivery metrics (WPM, filler words, hedging words, pauses, answer length, talk ratio, eye contact) are computed in code, not by the model. Never score accent.

---

## 10. Build phases, acceptance criteria, testing

1. **Phase 0 — Foundation:** Next.js + TS strict + Tailwind + shadcn/ui, Supabase migrations + RLS + seed (50 questions/MVP track, 3 rubrics), Auth (Google + magic link), design tokens, light/dark mode, app shell, marketing layout.
2. **Phase 1 — Text mock + report (MVP core without voice):** Session setup, question plan builder, text chat interview with streaming AI + adaptive follow-ups, grader job, report page, single-question drills.
3. **Phase 2 — Voice interviewer:** Gemini Live API with ephemeral tokens, device check, live captions, barge-in, orb, transcript timestamps + delivery metrics, optional camera/recording, replay player.
4. **Phase 3 — Content and progress:** Public SEO question bank, company pages, Learn hub, Story Bank, Progress dashboard, Interview Plan, Admin panel.
5. **Phase 4 — Technical rooms:** Coding room (Monaco + sandbox), Whiteboard room (Excalidraw), Case room, Panel & one-way video formats.
6. **Phase 5 — Payments and launch:** Stripe, usage metering, Resend, PostHog, Sentry, privacy/GDPR controls.
7. **Phase 6 — Growth:** Peer mocks, coaching marketplace, B2B team dashboard, more languages, PWA.
