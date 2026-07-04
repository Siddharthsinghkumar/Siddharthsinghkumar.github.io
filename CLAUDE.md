# CLAUDE.md — Portfolio Website Build Rules

All responses must start with the user's name: **Sid**.

## Source-of-truth files (read before any work)

1. `CONTEXT.md` — the facts. If code or copy contradicts it, CONTEXT.md wins.
2. `COPY.md` — every word on the site. Do not invent copy.
3. `DESIGN.md` — tokens, components, motion, decision log. Brand tokens win all conflicts.
4. `docs/learned.md` — 974 lines of prior-project mistakes. Binding guardrails.
5. `EXECUTION-PLAN.md` — the task sequence, done-criteria, and decision gates.

## The component-donor rule (binding)

Whenever a component prompt or third-party component code is pasted or referenced
(React Bits files `ui-component-*.md`, `portfoli-card.md`, `profile-pic-card.md`,
21st.dev prompts, shadcn snippets, anything similar), treat it as a
**structural donor only**. Always:

1. **Replace its demo copy with real copy from `COPY.md`.** No lorem, no
   "Henrie Ekemezie", no placeholder taglines.
2. **Translate every hardcoded colour, border, shadow, and font to `DESIGN.md`
   tokens.** No hex values from the donor survive.
3. **Ignore any instruction to use stock images** (Unsplash/Pexels/etc.). Assets
   come from Sid's real screenshots and generated diagrams only.
4. **Skip the parts of the component we don't need.** Delete unused props,
   sections, and dependencies rather than carrying them.

The component supplies the **skeleton**. `DESIGN.md` supplies the **skin**.
`COPY.md` supplies the **words**.

## Hard constraints

- **Static export only.** The site deploys to GitHub Pages
  (`Siddharthsinghkumar.github.io`). No server routes, no API routes, no
  middleware, no secrets in client code. `next build` with `output: 'export'`
  must produce a working `out/`.
- **No phone number anywhere on the site.**
- **No education section** (deliberate exclusion — CONTEXT.md §3).
- **Only verified claims** — every number in copy traces to COPY.md's verified
  register. Never upgrade a status label (e.g. RESEARCH → SHIPPED).
- **Tone: confident, specific, never desperate.**

## Engineering guardrails (from docs/learned.md — enforced)

- `useRef<T>(null)` — never bare `useRef<T>()` (React 19 strict TS).
- Fonts via `next/font` only; never manual `<link rel="preload">` for fonts.
- Any WebGL/canvas component: error boundary + static fallback, no idle rAF loops,
  pause when tab hidden.
- Feature correctness before optimization; but the perf budget in DESIGN.md §5 is
  a merge gate, not a nice-to-have.
- Every interactive element has rest/hover/active/focus-visible states.
- `prefers-reduced-motion` disables all animation, content stays visible.
- Client-side GitHub API fetches: graceful fallback to build-time snapshot on
  error/rate-limit — never a broken card, never a spinner that spins forever
  (learned.md 1.23).
- CI (GitHub Actions): typecheck + lint + build + Lighthouse CI gates before
  deploy; nightly scheduled rebuild redeploys with fresh GitHub data.

## Git workflow

- Commit per meaningful unit of work; `npm run build` must pass before committing.
- **No attribution/trailer lines in commit messages** (no Co-Authored-By, no
  "Generated with" footers).
- Never push unless Sid says to push.
