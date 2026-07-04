# Reference Skills, MCPs, CLI Tools & Frameworks

> Extracted from Sindhey Pathology Website — every skill, MCP, CLI, and framework we used or had available.

---

## Core Skills Actively Used (8)

| Skill | Source | Purpose |
|-------|--------|---------|
| **ponytail** | `npx skills add DietrichGebert/ponytail` | YAGNI codebase audit: dead code, over-engineering, unnecessary abstractions, unused dependencies |
| **red-team-security** | Built-in `.agents/skills/` | Full security audit: auth/authz, input validation, webhook security, CSP, rate limiting, PII handling |
| **design-taste-frontend** | `npx skills add Leonxlnx/taste-skill` | Anti-slop frontend design: hero, auth pages, typography, color tokens, UI polish |
| **clerk-nextjs-skills** | Built-in `.commandcode/skills/` | Clerk v7.4+ setup, proxy.ts migration, custom domain, MCP integration |
| **supabase** | Built-in `.commandcode/skills/` | Supabase schema design, migrations, RPC functions, RLS, client API usage, MCP server |
| **animation-vocabulary** | Built-in `.commandcode/skills/` | Reverse-lookup glossary for animation/motion effect naming |
| **review-animations** | Built-in `.commandcode/skills/` | Reviews animation code against Emil Kowalski design engineering philosophy |
| **emil-design-eng** | Built-in `.commandcode/skills/` | UI polish, component design, animation decisions, invisible details |

---

## Available Skills — Not Directly Invoked (17)

| Skill | Domain |
|-------|--------|
| **agents-md** | AGENTS.md/CLAUDE.md creation and maintenance |
| **ai-sdk-6-skills** | AI SDK 6 Beta — agents, tool approval, Groq, Vercel AI Gateway |
| **authjs-skills** | Auth.js v5 setup for Next.js authentication |
| **code-review** | Sentry-style code review: security, performance, testing, design |
| **code-simplifier** | Code clarity, consistency, maintainability |
| **commit** | Conventional commit format with issue references |
| **create-branch** | Git branch naming conventions |
| **find-bugs** | Bug/vulnerability detection in local branch changes |
| **gha-security-review** | GitHub Actions workflow exploitation audit |
| **impeccable** | Full frontend interface design/review/polish (design + UX + perf + a11y + motion) |
| **mcp-server-skills** | Pattern for building MCP servers in Next.js with mcp-handler, shared Zod schemas |
| **nextjs16-skills** | Next.js 16 key facts, breaking changes, documentation references |
| **performance-and-web-vitals** | Lighthouse audit + Core Web Vitals optimization |
| **security-review** | Security code review with confidence-based reporting |
| **semantic-html-and-seo** | HTML5 semantics, SEO fundamentals, progressive enhancement |
| **skill-writer** | Agent skill creation, synthesis, and iterative improvement |
| **wcag-accessibility** | WCAG 2.2 Level AA compliance for UI design/review |

---

## Dembrandt Design Sub-Skills (28)

> Full brand-to-UI pipeline — loaded via the `dembrandt` orchestrator skill.

| # | Skill | Domain |
|---|-------|--------|
| 1 | algorithmic-color-palette | UI color system derived from brand colors |
| 2 | brand-guidelines | Brand voice, copy tone, messaging |
| 3 | brand-visual-language | Visual tone: rounded vs angular, playful vs serious |
| 4 | button-states | Complete interactive state design (rest, hover, active, focus, disabled, loading) |
| 5 | color-mode-and-theme | Light/dark/combined mode decisions |
| 6 | component-family-consistency | Buttons/inputs/pills/badges share same border-radius, color, spacing |
| 7 | data-display-and-selection | Grid/list/table view modes, row/card selection UX |
| 8 | elevation-and-depth | Shadows, layering, elevation system for cards/modals/tooltips |
| 9 | form-design | Three-layer guidance: helper text, placeholder, validation |
| 10 | gestalt-ui-organisation | Visual grouping principles for layout and controls |
| 11 | global-toolbar-controls | Persistent global settings: currency, language, region |
| 12 | information-architecture | Navigation naming, data-model-to-UI mirroring |
| 13 | layout-paradigms-and-consistency | Feed/board/table/canvas/master-detail choice and reuse |
| 14 | loading-states-and-perceived-performance | Skeleton screens, staggered animations, loading UX |
| 15 | micro-interactions | Animated icons, toggles, subtle reveals, delight moments |
| 16 | modular-scale-typography | Ratio-based type scales for cohesive font sizing |
| 17 | motion-and-storytelling | Disney's 12 animation principles applied to web UI |
| 18 | nielsen-usability-heuristics | 10 usability principles for interface evaluation |
| 19 | notifications-and-recovery | Toasts, inline errors, banners, recovery paths |
| 20 | real-world-metaphors | Physical-world UI patterns: cards, drawers, carousels |
| 21 | responsive-paradigms | Mobile/tablet/desktop as different interaction paradigms |
| 22 | scroll-areas | Single-axis, user-controlled scrolling |
| 23 | status-colors-and-errors | Minimal consistent semantic color system |
| 24 | sticky-and-fixed-elements | Persistent headers, bottom toolbars, floating actions |
| 25 | ui-context-and-scope | Breadcrumbs, region labels, hierarchy communication |
| 26 | ui-density | Information density matching platform + user type |
| 27 | user-flows-and-guided-paths | Wizards, multi-step flows, onboarding sequences |
| 28 | visual-emphasis-and-hierarchy | Size, color, weight, position for action importance |

---

## MCP Servers

| MCP | Provider | Purpose |
|-----|----------|---------|
| **Supabase MCP** | Supabase | Database schema introspection, query execution, migration management |
| **Clerk MCP** | Clerk (via clerk-nextjs-skills) | Auth configuration, user management, session inspection |
| **Reform MCP** | Reform | Form generation and validation integration |
| **Vercel AI Gateway MCP** | Vercel (via ai-sdk-6-skills) | AI model routing and tool approval |
| **Sentry MCP** | Sentry | Error monitoring, release tracking, issue management |

---

## CLI Tools (11)

| Tool | Purpose |
|------|---------|
| **Vercel CLI** | Deployments, logs, env management, production promotion |
| **Supabase CLI** | Local dev (`supabase start`), migrations, `db reset`, `db lint`, `db dump`, `db push` |
| **Sentry CLI** | Release tracking, source map upload, error monitoring (org:ci scope) |
| **Playwright** | 39 e2e tests with multi-auth states, axe-core a11y integration |
| **Jest** | 132 unit/API route tests, enum guardrail, mock factories |
| **Lighthouse CI** (`@lhci/cli`) | 10 URLs × 4 categories, CWV assertions, CI merge gate |
| **Cashfree SDK** | Payment gateway via `sdk.cashfree.com` iframe integration |
| **MSG91 API** | WhatsApp OTP send/verify, booking confirmations, cancellations |
| **Resend** | Admin transactional emails, daily summaries |
| **Cloudflare Turnstile** | Bot protection (CAPTCHA alternative — anti-automation) |
| **puppeteer** | Load testing (60 concurrent visitors), traffic generation scripts |

---

## Frameworks & Libraries (15)

| Framework | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2 | App Router, server components, streaming, ISR |
| **React** | 19.2 | UI library — server components, use() hook, strict TS |
| **TypeScript** | 5.x | Strict mode, `useRef<T>()` requires initial value |
| **Tailwind CSS** | 4.x | Utility-first CSS, `@tailwindcss/postcss` |
| **Supabase** | JS v2 | Postgres 17.6, service-role access, RPC functions |
| **Clerk** | v7.4+ | Auth — no `SignedIn`/`SignedOut`, `useAuth()` + `isSignedIn` |
| **Cashfree** | Latest | Payment gateway — orders, refunds, webhooks |
| **MSG91** | REST API | WhatsApp Business API — templates, OTP, notifications |
| **Resend** | 6.x | Transactional email — admin alerts, booking confirmations |
| **Sentry** | 10.x | Error monitoring, performance tracing, source maps |
| **Zod** | 4.x | Runtime schema validation for all API routes and env vars |
| **Zustand** | 5.x | Client-side state management for booking wizard |
| **React Hook Form** | 7.x | Form state management with Zod resolver |
| **Three.js** | 0.184 | 3D rendering via @react-three/fiber + @react-three/drei |
| **Lucide React** | 1.x | Icon library |

---

## Stats

| Metric | Count |
|--------|-------|
| Core skills actively invoked | 8 |
| Available skills (context-active) | 17 |
| Dembrandt design sub-skills | 28 |
| MCP servers | 5 |
| CLI tools | 11 |
| Frameworks & libraries | 15 |
| **Total** | **84** |
