# Everything We Learned — Sindhey Pathology Website

> 427 commits, 120 taste preferences, 60+ docs, 165 graphify nodes, 42 bugs fixed.
> Compiled 2026-07-04.

---

## 1. MISTAKES & BAD DECISIONS

### 1.1 — Phone Number Format Chaos (CRITICAL)

**What happened:** Phone numbers were formatted in ~18 different places using 3 incompatible conventions: `+91XXXXXXXXXX`, `91XXXXXXXXXX`, and bare `XXXXXXXXXX`. No single normalizer existed.

**Cost:** 5 production bugs spanning money, auth, and data integrity:

| Bug | What Broke | Commit |
|-----|-----------|--------|
| C1 | All online payments rejected (customer_phone `+91` prefix vs bare 10 in Zod) | `85ea4fb` |
| C2 | Registered users couldn't pay (OTP gate `91`… vs `+91`…) | `85ea4fb` |
| H4 | Admin-created bookings invisible to patients (write bare, query `+91`) | `85ea4fb` |
| DPDP Fix 1 | Guest PII never anonymized during purge (phone format mismatch) | `d3ed779` |
| E3 | Reschedule route: ownership comparison broke on format mismatch | `cb8cf7c` |

**Fix:** Created `lib/phone.ts` — canonical normalizer (`toBare10`, `toE164`, `toStored`, `phonesEqual`) wired through all 18 sites in one pass (`9f6c527`, `85ea4fb`, `d153dbd`).

**Lesson:** Any multi-format identifier (phone, email, SSN) needs a canonical normalizer BEFORE any code writes it. This is a day-zero file.

---

### 1.2 — Postgres Enum Silent Failure (CRITICAL)

**What happened:** Writing an invalid enum value to a Postgres enum column doesn't throw — the DB silently rejects the row. Nobody checked the error.

**Cost:** 3 separate silent data-loss bugs:

| Bug | What Broke | Commit |
|-----|-----------|--------|
| C3 | Refunds moved real money at Cashfree but DB update silently failed (`refund_initiated` not in `payment_status_t`) | `20cc1ba`, `39844be` |
| H1 | Admin cash/UPI booking creation failed (`cash`/`upi` not in `payment_mode_t`) | `0824ece` |
| M2 | Refund webhook audit trail silently failed (`payment_refunded` not in `history_action_t`) | `39844be` |

**Fix:** Added missing enum values (migration 010). Created `__tests__/enums.test.ts` guardrail that imports generated `database.types.ts` enum lists and asserts every code-written status/mode/action string is a valid member.

**Lesson:** Typescript doesn't catch Postgres enum mismatches. Every project using Postgres enums needs a test that cross-references code-written strings against the live enum.

---

### 1.3 — Rate Limiting Failed Open (CRITICAL)

**What happened:** On any Supabase error or missing config, `checkRateLimit` returned `{allowed: true}`. The `check_rate_limit` RPC was never deployed to production, and the code called the wrong function name (`increment_rate_limit` vs `check_rate_limit`).

**Cost:** Every rate-limited endpoint (OTP, booking lookup, payment create, admin actions) had zero throttle protection in production. This was the master key for PII harvesting, OTP brute force, and cost abuse.

**Fix:** Three-part: (1) codify the RPC into migrations from live DB definition, (2) reconcile JS call to correct function name, (3) add `sensitive` parameter — fail-closed on security-critical endpoints, fail-open only for non-security throttles (`c9a9759`, `d0cd02c`, `4e4c8b8`).

**Lesson:** Rate limiting that fails open is worse than no rate limiting — it creates false confidence while being completely bypassable.

---

### 1.4 — E2E Tests Were Fake Coverage (HIGH)

**What happened:** The entire admin/staff/patient e2e test suite ran as unauthenticated users. `auth.setup.ts` had all real Clerk login steps commented out. Every assertion was against the login page. No admin/staff features were actually tested.

**Cost:** Auth bugs (login redirect loops, verify-phone bounce, Clerk metadata claim mismatch) shipped to production with green CI.

**Fix:** Installed `@clerk/testing`, implemented `setupClerkTestingToken()`, created 3 real storage states (admin/staff/patient), set `publicMetadata` BEFORE sign-in so JWTs carry correct claims, boot ephemeral Supabase per run, added `E2E_TEST_MODE` seam (`58322c8`).

**Lesson:** E2E with mocked auth is fake confidence. Clerk testing tokens + ephemeral DB are the minimum viable auth harness.

---

### 1.5 — Production DB Drifted From Migrations (HIGH)

**What happened:** Migration `007` was never applied to production. The entire Phase 4/5 staff dashboard, cancellation queue, and "Mark Report Delivered" feature were deployed but broken because the tables and columns didn't exist.

**Cost:** `cancellation_requests` table didn't exist. `dispatched_at`/`collected_at` columns didn't exist. `delivered_at`/`delivery_method` didn't exist. Staff couldn't do anything.

**Fix:** Applied migration 007 (OPS-1). Created `live-schema.sql` as ground truth (re-dumped after every migration). All code now verified against live dump, not migration files. Regenerated types from live dump.

**Lesson:** Migration files, generated types, and production DB are three different schemas. Only the live dump is ground truth. "Verified against live-schema.sql, not migrations" is now a standing rule.

---

### 1.6 — Env Var Naming + Sensitive Flag Trap (HIGH)

**What happened:** Code read `process.env.MSG91_WHATSAPP_NAMESPACE` but Vercel had it as `WHATSAPP_NAMESPACE`. The variable was marked Sensitive (write-only), so its value couldn't be read back to re-key under the correct name.

**Cost:** WhatsApp OTP was completely broken in production for the entire duration it was deployed. No way to know how long.

**Fix:** Code-side fallback: `process.env.WHATSAPP_NAMESPACE || process.env.MSG91_WHATSAPP_NAMESPACE` (`af9478b`). Added `lib/env.ts` Zod schema validating every runtime-critical env var at build time.

**Lesson:** Every runtime-critical env var must be validated at build time in a Zod schema. Sensitive vars are write-only — you cannot fix a naming mistake from the dashboard.

---

### 1.7 — Clerk Session Metadata Claim Mismatch (HIGH)

**What happened:** Clerk's `proxy.ts` middleware read `sessionClaims.publicMetadata` but this Clerk instance surfaced public metadata under the `metadata` claim. 5 different files each had their own reader with different fallback logic.

**Cost:** Verified admins redirected to `/admin/login`. Verified patients bounced to `/verify-phone`. Probable production auth outage for all authenticated users since deploy.

**Fix:** Created `lib/session-metadata.ts` with `getSessionMetadata()` that reads `publicMetadata || metadata` — one canonical reader for all 5 consumption sites (`1177b85`, `29d1c9a`).

**Lesson:** Clerk's metadata claim path varies by instance. One canonical reader is mandatory. Never let 5 different files each implement their own metadata access pattern.

---

### 1.8 — Admin Demotion Didn't Revoke Access (HIGH)

**What happened:** `toggleAdminRole` set `staff.active = false` but authorization read the Clerk JWT `publicMetadata.role` which was auto-patched to `'admin'` on first access and never cleared. A demoted admin kept full admin access.

**Fix:** Clear Clerk `publicMetadata.role` on demotion (`e73c1fb`).

**Lesson:** Authorization that reads from two sources (JWT + DB) must update both on status change. Revocation in one source without the other is a false sense of security.

---

### 1.9 — Payment DB-First Not Enforced (HIGH)

**What happened:** The payment creation flow called Cashfree's order API BEFORE inserting the DB payment row. If the DB insert failed after, the user was charged at Cashfree with no trace in our system.

**Fix:** Reversed the order: insert `payments` row (status `pending`, gateway_order_id NULL) FIRST, THEN call Cashfree. Update with gateway_order_id on success or delete/mark-failed on error. Added `order_tags: { booking_id }` so webhooks can recover even if local row missing (`7ad7ec0`, `8bcf12b`).

**Lesson:** DB-first payment anchoring. Write the row first, then call the gateway. Never the other way around.

---

### 1.10 — `rm -rf .git` Broke Sentry Deploy (Recurring)

**What happened:** Someone added `rm -rf .git` to reduce Vercel upload size. Sentry's `withSentryConfig` needs `.git` to detect the release version and upload source maps. Fixed, then broke again when re-added.

**Cost:** Source maps not uploaded → Sentry errors unreadable. Happened twice.

**Lesson:** `rm -rf .git` in deploy steps silently breaks Sentry release detection. Taste rule: never do it.

---

### 1.11 — Jest Never Ran in CI (HIGH)

**What happened:** The original CI (`pr-check.yml`) only ran `typecheck` + `build`. The unit test suite never gated merges. 3 suites / 4 tests were failing from test drift.

**Cost:** Tests that would have caught enum mismatches, phone format bugs, and auth guard issues were never executed.

**Fix:** CI now has `check` script that runs Jest. Tests fixed to 132/132 green.

**Lesson:** Tests that don't run in CI are dead code. Every test suite must be part of the merge gate.

---

### 1.12 — Design Docs Contradicted Shipped Product (MEDIUM)

**What happened:** `DESIGN.md` described a light navy/white theme forbidding glassmorphism. The shipped app had 98 dark-bg uses, 32 glass/blur uses, 48 ghost cards, 18 gradients.

**Cost:** Design audit flagged this as P1 "identity drift." Every design decision was argued against a doc that described a product that didn't exist.

**Fix:** Updated `DESIGN.md` to match reality. The dark-glass theme is intentional. `Current-State-2026-07-01` is now authoritative over design docs.

**Lesson:** Docs must match the shipped product. When they don't, fix the docs (not the product, unless the product is wrong).

---

### 1.13 — `NODE_ENV` Is Not a Deployment Guard (MEDIUM)

**What happened:** The `E2E_TEST_MODE` seam keyed off `NODE_ENV !== 'production'`. CI runs a prod build (`NODE_ENV=production`) that isn't a prod deployment, so the seam was disabled and e2e tests hit real external services.

**Fix:** Changed guard to `VERCEL_ENV === 'production'`.

**Lesson:** `NODE_ENV` tells you the build mode, not the deployment environment. Use platform-specific env vars for deployment guards.

---

### 1.14 — `useRef<T>()` Fails in React 19/Next.js 16 (MEDIUM)

**What happened:** `useRef<T>()` without an initial argument fails strict TypeScript in this version of React/Next.js.

**Lesson:** Always pass an explicit initial value: `useRef<T>(null)` or `useRef<T>(initialValue)`.

---

### 1.15 — Font Preload Tags Wrong in Next.js 16 (MEDIUM)

**What happened:** Manual `<link rel="preload">` tags for Geist font pointed to dev-only paths (`/__nextjs_font/`) that don't exist in production.

**Lesson:** Next.js 16 manages font loading automatically via `next/font`. Never add manual preload tags for built-in fonts.

---

### 1.16 — Cashfree SDK `eval()` Blocks CSP (MEDIUM)

**What happened:** Wanted to remove `'unsafe-eval'` from CSP but Cashfree SDK uses `eval()` internally. Same for Clerk SDK.

**Lesson:** Always grep `node_modules` for `eval()`, `new Function()`, and string-based timers before removing `'unsafe-eval'` from CSP. If the SDK needs it, the CSP needs it.

---

### 1.17 — IST Timezone on Serverless Is UTC (MEDIUM)

**What happened:** Admin dashboard tabs (Today/Upcoming/Past) showed wrong data because the Vercel server runs in UTC, not IST (UTC+5:30).

**Fix:** Explicit IST offset: `const istNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000)`.

**Lesson:** Serverless functions default to UTC. Any locale-specific date logic needs explicit offset math.

---

### 1.18 — `searchParams` Is a Promise in Next.js 15+ (MEDIUM)

**What happened:** `searchParams` became a Promise in Next.js 15+. Code that accessed it synchronously broke.

**Lesson:** Always `await searchParams` before using values.

---

### 1.19 — Lazy SDK Init Prevents Build Crashes (MEDIUM)

**What happened:** Module-level `new Razorpay()` crashed Next.js builds during static page generation when env vars were missing.

**Fix:** Lazy initialization with cached singleton getter: `getRazorpay()`.

**Lesson:** Server-side SDKs should use lazy init with cached singletons. Module-level instantiation crashes builds.

---

### 1.20 — Supabase `insert().onConflict().doNothing()` Doesn't Exist (MEDIUM)

**What happened:** This API doesn't exist in Supabase JS v2. Code silently failed.

**Fix:** Use `.upsert()` with `{ onConflict, ignoreDuplicates: true }`.

**Lesson:** Supabase JS v2 has no `.doNothing()`. Use `.upsert()`.

---

### 1.21 — Clerk userId vs Profile UUID Confusion (MEDIUM)

**What happened:** Multiple places used Clerk's `"user_xxx"` format ID directly as a UUID FK, causing constraint violations.

**Fix:** Look up profile UUID by `clerk_user_id` first, then use that UUID.

**Lesson:** Clerk user IDs are not UUIDs. Never use them directly in UUID FK columns.

---

### 1.22 — OTP Persist Before Consume (MEDIUM)

**What happened:** OTP was marked consumed BEFORE the Supabase upsert. If upsert failed, the OTP was burned and couldn't be retried.

**Fix:** Upsert first, verify success, THEN mark OTP consumed.

**Lesson:** OTP consumption must happen AFTER persistence is confirmed, never before.

---

### 1.23 — Auth Error States Not Handled (MEDIUM)

**What happened:** Client components fetching from API routes with auth gates silently showed empty data or infinite spinners on non-200 responses.

**Fix:** Explicit error UI with "Session expired, please refresh" + refresh button.

**Lesson:** Every client component fetching from an auth-gated API route must handle non-200 with user-visible error UI.

---

## 2. THIRD-PARTY & DEPENDENCY LESSONS

### Clerk

| # | Lesson |
|---|--------|
| 1 | Custom domain needs DNS CNAME → `integrations.clerk.com`. Without it: `failed_to_load_clerk_js`. |
| 2 | Clerk v7.4+ removed `SignedIn`, `SignedOut`, `Show`. Use `useAuth()` + `isSignedIn` instead. |
| 3 | `clerkMiddleware()` from `@clerk/nextjs/server`, NOT deprecated `authMiddleware`. |
| 4 | After `clerkClient().users.updateUserMetadata()`, frontend MUST `session.reload()` + verify claim updated + `getToken({ skipCache: true })` before redirect. |
| 5 | If claim still stale after retry loop, use `window.location.href` hard redirect, not `router.push()`. |
| 6 | Clerk `<SignIn>`/`<SignUp>` iframe components add ~200KB JS + 7-8s LCP + 1160ms INP. Native `useSignIn()` hook eliminates this. |
| 7 | Clerk custom domain must be in CSP: `script-src`, `script-src-elem`, `connect-src`, `frame-src`. Also `accounts.{domain}` + `*.clerk.accounts.dev`. |
| 8 | `session.user.publicMetadata` and `useAuth().sessionClaims` are SEPARATE objects. Refreshing one doesn't refresh the other. |
| 9 | Clerk v6 metadata: access via `sessionClaims.publicMetadata` only — NOT `sessionClaims.metadata?.role`. |
| 10 | Turnstile CAPTCHA in Clerk needs `https://challenges.cloudflare.com` in `script-src`, `frame-src`, `connect-src`. |
| 11 | After metadata mutation, bypass Clerk stale JWT by querying source-of-truth DB from server component, passing as prop to client. |
| 12 | `<SignIn>` component handles client-side rendering internally — don't add `'use client'` to its page. |
| 13 | `fallbackRedirectUrl="/"` is correct for SignIn; `forceRedirectUrl="/verify-phone"` only for SignUp (new signups). |
| 14 | In Clerk middleware, explicitly exclude login route with separate `createRouteMatcher` to prevent redirect loops. |
| 15 | Middleware should have Supabase DB fallback for every gated claim — Clerk JWT lags behind source of truth. |

### Supabase

| # | Lesson |
|---|--------|
| 1 | Service-role key + RLS bypassed is the security model. RLS policies are vestigial in Clerk-auth projects. |
| 2 | `.insert().onConflict().doNothing()` doesn't exist in JS v2. Use `.upsert()` with `{ onConflict, ignoreDuplicates }`. |
| 3 | PGRST204 means column doesn't exist in production — probe with test requests, don't trust local schema. |
| 4 | Verify RPC exists before calling `supabase.rpc()` — missing RPCs fail silently. |
| 5 | Run `generate_types.py` after every schema change and commit the regenerated types. |
| 6 | FK columns referencing UUID: never use Clerk `userId` directly (it's `"user_xxx"` format). |
| 7 | OTP upsert: only `clerk_user_id`, `phone`, `is_phone_verified`, `phone_verified_at`. Never include nullable NOT NULL columns. |

### Cashfree

| # | Lesson |
|---|--------|
| 1 | `CASHFREE_ENV` must match key type. Prod keys (`cfsk_ma_prod_...`) → `CASHFREE_ENV=production`. Mismatch → "Could not initiate payment." |
| 2 | DB payment row FIRST (status `pending`), Cashfree order SECOND. If DB insert fails after gateway call, user is charged with no trace. |
| 3 | Pass `order_tags: { booking_id }` so webhooks can recover even if local payment row is missing. |
| 4 | `https://sdk.cashfree.com` must be in `script-src` + `frame-src` CSP. `https://api.cashfree.com` in `form-action` + `frame-src`. |
| 5 | Payment verification must distinguish gateway statuses: ACTIVE → polling, EXPIRED → "session expired." Not one generic message. |
| 6 | Payment return page: AbortController timeout, auto-retry polling, manual "Retry verification" button. |
| 7 | Cross-table payment confirmation: use Postgres RPC with `SECURITY DEFINER` for atomicity. |

### MSG91 / WhatsApp

| # | Lesson |
|---|--------|
| 1 | Sender number must be registered as "integrated number" in MSG91 dashboard. Unregistered → "WhatsApp not integrated." |
| 2 | Auth templates use different payload structure from utility templates. Check MSG91 dashboard `Code{JSON}` for exact format. |
| 3 | Validate all template variable values before building payload. `undefined` JavaScript → literal `"undefined"` in WhatsApp message. |
| 4 | Send superset of all body variables — MSG91 silently ignores extras not in the active template. |
| 5 | Store template namespace in `WHATSAPP_NAMESPACE` env var. Missing → template rejection. |
| 6 | Template names configurable via env var with fallback default — allows switching templates without redeploy. |
| 7 | Log full payload before sending to catch missing variables. |

### Webhooks

| # | Lesson |
|---|--------|
| 1 | Always `crypto.timingSafeEqual()` for HMAC signature verification. Never `===` or `!==` (timing attack). |
| 2 | Return HTTP 200 on signature verification failure — gateways retry on any non-200. |
| 3 | Wrap entire webhook handler in try/catch, return 200 in catch. Unhandled 500 → infinite retries. |
| 4 | Recover from missing payment rows: extract `booking_id` from gateway payload, verify booking + amount, INSERT payment row, fire admin alert. |
| 5 | Check for existing recent (20min) pending payment before creating new gateway order. Reuse `payment_session_id` if gateway order still ACTIVE. |

### Performance / Next.js

| # | Lesson |
|---|--------|
| 1 | Move all blocking async data fetching into child component inside `<Suspense>` — parent shell streams as static HTML immediately. |
| 2 | Don't call `await auth()` + DB query at page level for a navbar badge — adds ~1.7s TTFB for all visitors. Let client handle via `useAuth()`. |
| 3 | Sentry error logs: scan for build-time/env-config patterns first. Many errors cascade from one broken deploy. Fix the deploy, Sentry clears. |
| 4 | Don't resize images via CSS/HTML — re-render source at target dimensions with proper compression. |
| 5 | Download externally-hosted images and include locally. Avoids external DNS overhead, benefits from Next.js image optimization. |
| 6 | Decorative/overlay background images must NOT use `priority` prop — steals LCP from visible text content. |
| 7 | Extract hero section from `"use client"` shell into server component as prop — drops LCP from ~4s to ~0.5s. |
| 8 | Cookie consent banners via `setTimeout()` steal LCP measurement. Fix: `contentVisibility: "auto"` on banner container. |
| 9 | For `"use client"` pages, move client boundary down to interactive parts only. Server-render header/nav as static HTML outside Suspense. |
| 10 | Next.js 16 builds font files with hashed names per deployment. Never add manual preload tags for fonts. |
| 11 | WebP/AVIF instead of JPEG for hero/background images. Better quality at smaller sizes. |
| 12 | `useRef<T>()` without initial argument fails in React 19/Next.js 16 strict TS. Always pass explicit initial value. |
| 13 | Next.js 15+ `searchParams` is a Promise — await it before using. |
| 14 | Lazy SDK init with cached singleton getter prevents build crashes on missing env vars. |
| 15 | When CSS modifies image dimensions, use `fill` + `sizes` instead of explicit `width`/`height`. |

---

## 3. SKILLS, TOOLS & CLI USED

### Total: 45+ skills available, 8+ actively invoked

### Skills Used During This Project

| Skill | What It Did | When Used |
|-------|-------------|-----------|
| **ponytail** (`DietrichGebert/ponytail`) | YAGNI codebase audit: dead code, over-engineering, unnecessary abstractions, unused dependencies | Audit phase — removed 5 unused npm deps, dead files, dead exports, blanket eslint-disable directives |
| **red-team-security** | Full security audit: auth/authz, input validation, webhook security, CSP, rate limiting, PII handling | S1-S13 security findings, HTML injection, fail-open rate limits, admin privilege revocation |
| **design-taste-frontend** (`Leonxlnx/taste-skill`) | Anti-slop frontend design: hero, auth pages, bookings dashboard, typography, color tokens | WS-1 (design audit + tokenization), WS-2 (typography system), profile page refactor |
| **clerk-nextjs-skills** | Clerk v7.4+ setup, proxy.ts migration, custom domain, MCP integration | Auth system setup, middleware fixes, metadata claim sync |
| **supabase** | Supabase schema, migrations, RPC functions, RLS, client API usage | DB migrations, rate limit RPC, DPDP anonymize RPCs, schema fixes |
| **animation-vocabulary** | Reverse-lookup glossary for animation/motion effect naming | Design system motion vocabulary |
| **review-animations** | Reviews animation code against Emil Kowalski design engineering philosophy | Animation craft review |
| **emil-design-eng** | UI polish, component design, animation decisions, invisible details | Design craft decisions |

### Skills from AGENTS.md (not invoked directly but context-active)

| Skill | Domain |
|-------|--------|
| **agents-md** | AGENTS.md/CLAUDE.md creation and maintenance |
| **ai-sdk-6-skills** | AI SDK 6 beta, agents, tool approval, Groq, Vercel AI Gateway |
| **authjs-skills** | Auth.js v5 for Next.js |
| **code-review** | Sentry-style code review |
| **code-simplifier** | Code clarity, consistency, maintainability |
| **commit** | Conventional commit format with issue references |
| **create-branch** | Branch naming conventions |
| **find-bugs** | Bug/vulnerability detection in local changes |
| **gha-security-review** | GitHub Actions workflow exploitation audit |
| **impeccable** | Full frontend interface design/review/polish |
| **mcp-server-skills** | MCP server patterns in Next.js |
| **nextjs16-skills** | Next.js 16 key facts and breaking changes |
| **performance-and-web-vitals** | Lighthouse audit + Core Web Vitals optimization |
| **security-review** | Security code review with confidence-based reporting |
| **semantic-html-and-seo** | HTML5 semantics, SEO, accessibility |
| **skill-writer** | Agent skill creation and improvement |
| **sentry** | Sentry integration and configuration |
| **wcag-accessibility** | WCAG 2.2 Level AA compliance |

### Dembrandt Design Sub-Skills (brand-to-UI pipeline)

| Skill | Domain |
|-------|--------|
| algorithmic-color-palette | UI color system from brand colors |
| brand-guidelines | Brand voice and copy |
| brand-visual-language | Visual tone: rounded vs angular, playful vs serious |
| button-states | Complete interactive state design |
| color-mode-and-theme | Light/dark mode decisions |
| component-family-consistency | Buttons/inputs/pills/badges share same tokens |
| data-display-and-selection | Grid/list/table view modes, selection UX |
| elevation-and-depth | Shadows, layering, elevation system |
| form-design | Three-layer guidance: helper text, placeholder, validation |
| gestalt-ui-organisation | Visual grouping principles |
| global-toolbar-controls | Global settings placement |
| information-architecture | Navigation naming, data-UI mirroring |
| layout-paradigms-and-consistency | Feed/board/table/canvas/master-detail choice |
| loading-states-and-perceived-performance | Skeleton screens, staggered animations |
| micro-interactions | Animated icons, toggles, subtle reveals |
| modular-scale-typography | Ratio-based type scales |
| motion-and-storytelling | Disney's 12 principles in web UI |
| nielsen-usability-heuristics | 10 usability principles |
| notifications-and-recovery | Toasts, inline errors, banners, recovery paths |
| real-world-metaphors | Physical-world UI patterns |
| responsive-paradigms | Mobile/tablet/desktop are different interaction paradigms |
| scroll-areas | Single axis, user-controlled scroll |
| status-colors-and-errors | Minimal consistent semantic colors |
| sticky-and-fixed-elements | Persistent UI positioning |
| ui-context-and-scope | Breadcrumbs, region labels, hierarchy communication |
| ui-density | Information density matching platform + user type |
| user-flows-and-guided-paths | Wizards, multi-step flows |
| visual-emphasis-and-hierarchy | Size, color, weight, position for importance |

### CLI/Tools Used

| Tool | Purpose |
|------|---------|
| **Vercel CLI** | Deployments, logs, env management |
| **Supabase CLI** | Local dev (`supabase start`), migrations, `db reset`, `db lint`, `db dump` |
| **Sentry CLI** | Release tracking, error monitoring (`org:ci` scope — cannot read issues) |
| **Playwright** | 39 e2e tests with multi-auth states, axe-core a11y integration |
| **Jest** | 132 unit/API route tests, enum guardrail, mock factories |
| **Lighthouse CI** (`@lhci/cli`) | 10 URLs × 4 categories, CWV assertions, CI gate |
| **Cashfree SDK** | Payment gateway via `sdk.cashfree.com` iframe |
| **MSG91 API** | WhatsApp OTP + notifications |
| **Resend** | Admin transactional emails |
| **Cloudflare Turnstile** | Bot protection (anti-automation) |
| **puppeteer** | Load testing (`run-60.js`), traffic generation |

---

## 4. PROBLEM-SOLVING PATTERNS

### 4.1 — What Confused Us Most

| Confusion | Root Cause | How We Fixed |
|-----------|-----------|--------------|
| Clerk metadata claim path | Clerk v6 surfaces metadata under `metadata` not `publicMetadata` on this instance | Created `lib/session-metadata.ts` single reader |
| `session.reload()` not updating JWT claims | Clerk metadata mutations don't re-issue the JWT | Retry loop + `getToken({ skipCache: true })` + `window.location.href` fallback |
| `session.user.publicMetadata !== useAuth().sessionClaims` | These are SEPARATE objects | Always refresh session token after metadata change, verify claim, hard redirect if stale |
| Supabase `insert().onConflict().doNothing()` not working | API doesn't exist in JS v2 | Switched to `.upsert()` with `{ onConflict, ignoreDuplicates }` |
| `NODE_ENV=production` in CI | CI runs prod builds that aren't prod deployments | Changed guard to `VERCEL_ENV === 'production'` |
| Homepage TTFB ~1.7s | `await auth()` + DB query at page level for navbar badge | Moved auth-dependent UI to client, server-renders static shell |
| LCP element was a decorative image | `priority` prop on overlay background image forced it as LCP | Removed `priority`, let text H1 become LCP at <1s |
| Cookie consent banner stealing LCP | `setTimeout()` banner appeared at 2s → re-measured LCP | `contentVisibility: "auto"` excludes banner from LCP |
| `crypto.timingSafeEqual` needed for webhooks | `===` string comparison vulnerable to timing attacks | All webhook HMAC verification now uses `timingSafeEqual` |
| Cashfree `order_tags` recovery | Webhook payloads may not have `booking_id` in top-level fields | Extract from `order_tags`, verify booking + amount, insert payment row |

### 4.2 — Problem-Solving Methodology That Worked

1. **Adversarial audit** — assume everything marked "Done" in docs is broken. Line-by-line code read against live schema (`live-schema.sql`), not migration files.

2. **Root-cause-first, never fix-first** — diagnostic command phase (curl endpoints, check DB rows, compare timestamps) before any code change.

3. **Grep the whole codebase** — when a bug is found in one route, grep all routes for the same pattern. Fix inventory first, apply fix to all in one pass.

4. **Three-pass security audit** (Red Hat methodology) — pass 1: categorize by severity, pass 2: look for silent failures/PII leaks/missing auth, pass 3: review everything again.

5. **Canonical normalizer pattern** — any multi-format identifier gets ONE file with `toX()`, `fromX()`, `equals()` functions, wired everywhere.

6. **Enum guardrail** — test that cross-references code-written strings against live Postgres enum members.

7. **DB-first anchoring** — write the DB row, THEN call the external service. Never the other way around.

8. **Build-time env validation** — Zod schema validates every runtime-critical env var. Missing/misnamed vars fail the build.

9. **Fail-closed on security, fail-open on UX** — rate limiting: security-critical endpoints fail-closed, non-critical throttles can fail-open.

10. **`VERCEL_ENV` not `NODE_ENV`** — key all deployment guards off the platform's env, not Node's build mode.

---

## 5. THINGS WE SHOULD HAVE USED FROM THE START

| Thing | When We Actually Added It | Why From the Start |
|-------|--------------------------|-------------------|
| **`lib/phone.ts` canonical normalizer** | Remediation wave 2 (after C1, C2, H4, DPDP, E3 fix) | Would have prevented the 5 worst bugs. Day-zero file for any app with phone-based auth. |
| **`lib/env.ts` build-time Zod validation** | After C5 WhatsApp namespace outage | Would have caught the env var naming mistake at build, not in production. |
| **`__tests__/enums.test.ts` guardrail** | After C3 refund silence + H1 cash booking + M2 history action | Would have caught all 3 silent enum failures at test time. |
| **`@lhci/cli` Lighthouse CI** | Just wired (2026-07-04) | Would have caught LCP regressions, CLS from ShaderGradient, missing meta descriptions. |
| **`@clerk/testing` for e2e** | Remediation wave 4 | The admin/staff/patient e2e suite was fake coverage for months. Real Clerk testing tokens from day one would have caught auth redirect bugs before deploy. |
| **`@axe-core/playwright` a11y testing** | Remediation wave 4 | Contrast regressions, missing ARIA labels caught in CI instead of after deploy. |
| **Shadcn UI / Headless UI** | Never used (custom components) | Would have eliminated button-state bugs, form-label accessibility issues, and component inconsistency. |
| **`crypto.timingSafeEqual()` in webhooks** | Security audit fix | `===` comparison vulnerable to timing attacks from day one. Every webhook handler needs this. |
| **Native `useSignIn()` instead of Clerk iframe** | Never switched (stayed with `<SignIn>`) | Clerk iframe adds ~200KB JS, 7-8s LCP, 1160ms INP, 0.34 CLS. Native hooks eliminate this entirely. |
| **Postgres RPC for atomic cross-table updates** | After M1 double-send + C3 half-failure | `SECURITY DEFINER` RPCs prevent half-failure on payment confirmation. Should be used for every cross-table write. |
| **Error boundaries on WebGL components** | After ShaderGradient crashes | WebGL context failures crashed the homepage. Error boundary with CSS gradient fallback prevents this. |
| **Single CI workflow file** | After 2 duplicate workflows | Two workflows with same triggers caused confusion. Consolidated to one `auto-pr.yml`. |
| **Live `schema.sql` dump as ground truth** | After D1 migration 007 missing | Migration files, generated types, and prod DB diverged. Live dump is the only truth. |
| **IST timezone offset math** | After admin dashboard showed wrong dates | UTC on serverless Vercel gives wrong "Today" for IST hours. |
| **`E2E_TEST_MODE` guard keyed off `VERCEL_ENV`** | After it was disabled in CI | Originally keyed off `NODE_ENV` which is `production` in CI. |
| **Production-like local Supabase** | Never properly done early on | Developed against prod DB directly → unknown state, could break live data. Local Supabase + seed data from day one prevents this. |
| **Schema design review before coding** | Never done | Enums created without all possible values, columns referenced that didn't exist, FK types mismatched. 30min design review with Postgres knowledge would have prevented C3, H1, M2, D1, D3. |
| **Cashfree webhook testing in sandbox** | After M1 double-send + C3 refund | Webhook half-failure pattern (DB rejects row, gateway did the work) existed from day one and was invisible until adversarial audit. |
| **DB dump as canonical artifact** | After D1 migration 007 missing | Migration files are intent. `live-schema.sql` is reality. Should have been the canonical schema artifact from the start. |
| **Log external API payloads during development** | After C5 WhatsApp namespace + M10 gateway linkage | `MSG91_WHATSAPP_NAMESPACE` undefined → literal `"undefined"` in payload was never logged. Gateway order silently lost — never logged. Console.log payloads in dev would have caught both immediately. |
| **RLS decided consciously** | Never explicitly decided | RLS exists but is vestigial (keyed on `auth.uid()` which is null in Clerk model). Should have been explicitly opted out with an ADR from day one, not left in a confusing half-state. |
| **Trust-but-verify on "Done" docs** | After adversarial audit | Phase docs marked 20+ items "Done" that were broken. Never trust a feature tick mark without verifying the code and live schema. |
| **One DB column naming convention** | Patchwork fix | `phone_verified` in one place, `is_phone_verified` in another. `collection_address` vs `address`. `delivery_method` that didn't exist. Decide: snake_case, prefix conventions, nullable policy before writing any schema. |
| **Don't build UI without DB support** | After D1 + D3 + H4 | Staff dashboard, cancellation queue, "Mark Delivered" — all built with UI that referenced columns/tables that didn't exist in production. Verify schema BEFORE building the feature UI. |

### 5.2 — Stupid Things We Did That Could Have Been Avoided Entirely

| Stupid Thing | What It Cost | The Obvious Fix |
|-------------|-------------|-----------------|
| **Developing against production DB** | Risk of corrupting real patient data. Couldn't test destructive operations. No local reset-for-testing. | `supabase start` + seed script. 5 minutes to set up. |
| **Trusting phase docs marked "Done"** | 20+ features thought complete were broken. The entire staff dashboard, cancellation, and dispatch features didn't work against the live DB. | Read the code, not the docs. Assume "Done" means "not verified." |
| **Not wiring e2e tests until the end** | Zero real coverage for months. Auth bugs shipped because no test ran through a full login→action flow. | Write the e2e auth harness (Clerk testing tokens + ephemeral Supabase) on Day 2 before any feature code. |
| **Adding CSP headers retroactively** | Broke Cashfree iframe, Clerk JS, Turnstile, Google Maps. Each needed a CSP exception discovered one at a time in production. | CSP from day one with all external domains added as you integrate them. Never retrofit. |
| **Configuring Clerk custom domain without DNS first** | Clerk JS failed to load (`failed_to_load_clerk_js`) because CNAME wasn't set. Spent hours debugging JS when it was DNS. | DNS CNAME → verify → THEN configure Clerk custom domain. |
| **Cashfree prod keys in sandbox env** | "Could not initiate payment" for every user. Spent hours checking code when the error was `CASHFREE_ENV=sandbox` with prod keys. | Prod keys → `CASHFREE_ENV=production`. Sandbox keys → `CASHFREE_ENV=sandbox`. Never mix. |
| **Clerk `forceRedirectUrl="/verify-phone"` on SignIn** | Returning verified users forced back to verify-phone page. Every login was broken for existing users. | `fallbackRedirectUrl="/"` on SignIn, `forceRedirectUrl="/verify-phone"` only on SignUp (new signups). |
| **Building custom button/form components from scratch** | Missing hover states, broken focus rings, unassociated labels. Reimplemented what shadcn/ui gives for free. | Use a component library. Even 3-4 components (Button, Input, Label, Card) would have prevented 90% of UI bugs. |
| **Commenting out real e2e auth steps** | The entire e2e suite ran against the login page. Every test was "PASS" because the assertion was `expect(page).toHaveURL(/login/)`. | If you can't automate auth, document the blind spot (ADR-0007) and test manually. Don't ship fake green tests. |
| **`rm -rf .git` in deploy step (twice)** | Broke Sentry source map upload twice. The fix was simple both times — don't delete `.git`. Still happened again. | Never delete `.git` during build/deploy. Any CI step that needs smaller upload should use `.vercelignore` or explicit exclusions. |
| **Not running Jest in CI for months** | 4 tests were failing from drift. Those tests would have caught enum mismatches. Zero test gate on merge. | Jest goes in CI from Day 1. `npm test` in the merge gate alongside `typecheck` + `build`. |
| **Over-optimizing before things worked** | Spent time removing ShaderGradient, switching fonts, tokenizing colors — while payments were broken and WhatsApp OTP was 500-ing. | Feature correctness first, performance second. A fast broken app is still broken. |

---

## 6. 2-WEEK ROADMAP: How This Project Could Have Been Done in 14 Days

> Actual time: ~2 months (learning while building).
> Target: 2 weeks with all lessons applied.

### Day 1 — Foundation & Schema

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | `npx create-next-app@latest` + `npx supabase init` + `npm install @clerk/nextjs @supabase/supabase-js zod` | 2 hours → 30 min |
| Morning | Write `lib/env.ts` Zod schema — every env var validated at build time | Skipped → 30 min |
| Morning | Run `supabase start` — local DB with seed data | Never done early → 15 min |
| Afternoon | Design FULL DB schema on paper first: all tables, all enums with ALL possible values, all FK relationships, column naming convention | Never done → 2 hours |
| Afternoon | Write initial `schema.sql` migration — every table, every enum value | Spread across months → 2 hours |
| Afternoon | Dump `live-schema.sql` as canonical artifact | Never done early → 5 min |
| Evening | Create `lib/phone.ts` canonical normalizer (toBare10, toE164, toStored, phonesEqual) | After 5 bugs → 20 min |
| Evening | Create `__tests__/enums.test.ts` guardrail — cross-reference code strings vs live enum | After 3 silent failures → 15 min |
| Evening | Create `lib/format.ts` — fmtPrice, fmtDate, fmtTime (one canonical formatter) | Scattered → 15 min |

**Day 1 output:** DB schema designed, env validated, phone normalizer, enum guardrail, format helpers. All infrastructure in place BEFORE any feature code.

---

### Day 2 — Authentication

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | Set up Clerk project: API keys in `.env`, `clerkMiddleware()` in `middleware.ts`, `<ClerkProvider>` in layout | 1 day → 2 hours |
| Morning | DNS: CNAME `clerk.sindheypathology.com` → `integrations.clerk.com`, verify it resolves | 30 min → 15 min |
| Morning | Clerk custom domain in CSP: `script-src`, `connect-src`, `frame-src` | Retrofit → 15 min |
| Afternoon | Native `useSignIn()` / `useSignUp()` hooks (NOT Clerk iframe) — custom login/signup pages | Stayed with iframe (never switched) → 3 hours |
| Afternoon | OTP send/verify API routes with HMAC-SHA256 hashing | 2 days → 3 hours |
| Afternoon | `lib/session-metadata.ts` — ONE canonical reader for Clerk metadata | After claim mismatch bug → 15 min |
| Evening | `@clerk/testing` setup: `setupClerkTestingToken()`, 3 auth states (admin/staff/patient) | After months of fake e2e → 2 hours |
| Evening | Write auth e2e test: login → see dashboard (real, not mocked) | Never existed early → 1 hour |

**Day 2 output:** Auth works end-to-end. Real e2e auth harness. No iframe bloat. CSP covers Clerk from the start.

---

### Day 3 — Core Booking Flow

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | Test catalog page — fetch from DB, display packages, "Book Now" links | 2 days → 3 hours |
| Morning | Booking wizard: zustand store, multi-step form (patient details → tests → schedule → review) | 3 days → 4 hours |
| Afternoon | Server-side booking validation: Zod schema, slot capacity check, same-day cutoff, future-window cap | 2 days → 3 hours |
| Afternoon | Create booking API route: insert booking + booking_items in transaction | 1 day → 2 hours |
| Evening | Booking lookup page: booking_code + phone → status display | 1 day → 2 hours |
| Evening | `E2E_TEST_MODE` seam: guard off `VERCEL_ENV`, deterministically stub MSG91/Cashfree/Resend | After CI broke → 30 min |
| Evening | Write booking flow e2e test: select test → fill form → submit → verify booking exists in DB | 1 day → 1 hour |

**Day 3 output:** Patient can browse tests, book, and check status. E2e verifies the full flow.

---

### Day 4 — Payment Integration

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | Cashfree setup: API keys in `.env`, verify `CASHFREE_ENV` matches key type (prod keys → `production`) | 1 day → 1 hour |
| Morning | Cashfree SDK CSP: `sdk.cashfree.com` → script-src + frame-src, `api.cashfree.com` → form-action | Retrofit → 15 min |
| Morning | DB-first payment anchoring: INSERT payments row (status `pending`), THEN create Cashfree order, UPDATE with `gateway_order_id` | Wrong order (fixed later) → 2 hours |
| Afternoon | `confirm_paid_booking` Postgres RPC: `SECURITY DEFINER`, atomic cross-table update with `FOR UPDATE` row lock | After half-failure → 2 hours |
| Afternoon | Payment verify API route: check gateway status, distinguish ACTIVE/EXPIRED/PAID, return appropriate UI state | 1 day → 2 hours |
| Afternoon | Payment return page: AbortController timeout, auto-retry polling, manual "Retry" button | 1 day → 2 hours |
| Evening | Cashfree webhook: `crypto.timingSafeEqual()` HMAC, try/catch with 200 on failure, `order_tags` recovery for missing payment rows | After security audit → 2 hours |
| Evening | Test payment flow in Cashfree sandbox: create order → pay → verify DB updated | Scattered → 1 hour |

**Day 4 output:** Payments work. DB-first anchoring. Atomic confirmation RPC. Webhooks idempotent.

---

### Day 5 — Staff & Admin Dashboard

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | Staff dashboard: fetch bookings assigned to staff, action buttons (dispatch/collect/report) | 3 days → 3 hours |
| Morning | Staff actions API: `update-status` route with Zod validation, IST timezone offset for timestamps | 2 days → 2 hours |
| Afternoon | Admin bookings dashboard: all bookings, tabs (Today/Upcoming/Past) with IST filter | 2 days → 3 hours |
| Afternoon | Admin create booking: form with all booking_type + payment_mode options, Zod validates against live enum | 1 day → 2 hours |
| Afternoon | `requireAdmin()` / `requireStaff()` guards — ONE canonical guard per role, not duplicated 6 times | After 6 copies → 30 min |
| Evening | Cancellation flow: request → admin resolve (check collected_at before allowing refund) | 2 days → 2 hours |
| Evening | Test staff + admin flows e2e: login as staff → dispatch → collect → report ready | Never worked → 1 hour |

**Day 5 output:** Staff and admin can do their jobs. Authorization is correct. Cancellation respects sample states.

---

### Day 6 — Notifications & Communications

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | MSG91 WhatsApp: register sender number, verify templates in dashboard | 2 days → 2 hours |
| Morning | `lib/whatsapp.ts`: sendBookingConfirmation, sendReportToPatient, sendCancellationWhatsApp — fire-and-forget, log payload in dev | 2 days → 3 hours |
| Morning | MSG91 payload validation: check all template variables not undefined, log full payload before sending | After "undefined" bug → 30 min |
| Afternoon | Resend admin emails: booking-alert (fire on booking), cancellation-alert, daily-summary | 1 day → 2 hours |
| Afternoon | WhatsApp template env vars: `WHATSAPP_NAMESPACE`, template names configurable with fallback defaults | After namespace mismatch → 30 min |
| Evening | Test: create booking → verify WhatsApp sent (check MSG91 dashboard) → verify admin email received | Ad-hoc → 1 hour |

**Day 6 output:** All notifications fire. Payloads validated before sending. Env vars correct.

---

### Day 7 — Profile & Patient Experience

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | Profile page: read from DB, inline edit with Zod validation, phone verification badge | 2 days → 3 hours |
| Morning | Verify-phone page: OTP send → verify → update Clerk metadata + profile | 2 days → 3 hours |
| Afternoon | Complete-profile page: first-time profile creation after signup | 1 day → 2 hours |
| Afternoon | Booking history on profile: list patient's bookings with status | 1 day → 2 hours |
| Evening | Privacy, Terms, Refund Policy pages — static legal pages | 1 day → 1 hour |

**Day 7 output:** Complete patient experience from signup → profile → booking → history.

---

### Day 8 — Security Hardening

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | Rate limiting: `checkRateLimit` RPC in DB, `checkRateLimit()` in `lib/rate-limit.ts`, `sensitive` parameter for fail-closed on security endpoints | After fail-open bug → 3 hours |
| Morning | Apply rate limits: OTP 5/min, booking-lookup 5/min, payments 10/min, profile-read 30/min | Ad-hoc → 1 hour |
| Morning | CSRF protection: Origin-vs-Host check on all mutating API routes | After security audit → 1 hour |
| Afternoon | CSP headers: script-src, frame-src, connect-src, form-action with ALL external domains | Retrofit (broke things) → 2 hours |
| Afternoon | Webhook security: per-route allowlist (not blanket `/api/webhooks/*` exemption), timingSafeEqual on all HMAC | After audit → 1 hour |
| Afternoon | Sanitize admin search input: PostgREST filter injection prevention | After audit → 30 min |
| Evening | PII audit: remove console.log with phone numbers, strip plaintext OTPs from logs, Sentry PII disabled | After audit → 1 hour |
| Evening | Security e2e: test rate limiting blocks brute force, test CSRF rejection, test unauthenticated 401s | After audit → 1 hour |

**Day 8 output:** App is secure. Rate limiting works. CSP covers all domains. No PII in logs.

---

### Day 9 — Testing (Unit + E2e + A11y + Perf)

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | Jest unit tests: API route handlers, Zod validators, phone normalizer, enum guardrail, rate limiter | Spread across months → 4 hours |
| Morning | Jest mock factories: `TypedMockChain` for Supabase return types — strict type checking on all mocks | After test drift → 1 hour |
| Afternoon | E2e tests: full auth flows, booking creation, payment (sandbox), staff actions, admin cancel, booking lookup | After fake coverage → 3 hours |
| Afternoon | A11y tests: `@axe-core/playwright` on 10 key pages — zero serious/critical violations | After deploy → 1 hour |
| Afternoon | Lighthouse CI: `lighthouserc.js` with 10 URLs, desktop preset, perf/a11y/best-practices/SEO assertions | Just added → 30 min |
| Evening | Fix all failing tests → 100% green | Several rounds → 2 hours |
| Evening | Wire all test suites into CI merge gate: typecheck + build + test + e2e + lhci | After months → 30 min |

**Day 9 output:** 100+ tests green. CI gate blocks merge on any failure. Lighthouse CI in pipeline.

---

### Day 10 — Design Polish

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | Choose design direction: dark-glass theme (decide once, document in DESIGN.md matching shipped product) | 1 week of back-and-forth → 1 hour |
| Morning | Typography: Archivo headings + Inter body + JetBrains Mono numbers via `next/font` (not Google CDN) | 2 days → 2 hours |
| Afternoon | Theme tokens: CSS variables for surface colors, border colors, accent colors. NO hardcoded hex in components | After de-slop pass → 2 hours |
| Afternoon | Responsive: mobile-first for all pages. Test on 375px, 768px, 1280px | 2 days → 2 hours |
| Afternoon | Accessibility: proper heading hierarchy, form labels associated, focus rings visible, color contrast ≥ WCAG AA | 1 day → 2 hours |
| Evening | Homepage: hero section as server component (LCP H1 text at <1s), trust section, how-it-works, CTA | 3 days → 3 hours |
| Evening | Run Lighthouse: fix any perf < 0.75, a11y < 0.95, LCP > 3s | Iterative → 1 hour |

**Day 10 output:** App looks professional. Lighthouse green. Mobile works. Design docs match reality.

---

### Day 11 — CI/CD Pipeline

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | Single CI workflow: typecheck ∥ build ∥ test ∥ e2e ∥ lhci → merge(AND) → deploy preview | 4 workflow files → 2 hours |
| Morning | `.github/workflows/auto-pr.yml`: push to dev → all gates → auto PR dev→main → Vercel preview deploy | After months → 1 hour |
| Morning | Vercel: link project, set all env vars (match `.env.example` exactly, no name mismatches) | Ad-hoc → 1 hour |
| Afternoon | Deploy preview: verify all pages load, auth works, payments work in sandbox | Ad-hoc → 2 hours |
| Afternoon | Sentry: `withSentryConfig`, source maps, release tracking, PII disabled, trace sampling 0.1 | 1 day → 2 hours |
| Afternoon | Vercel cron: `expire-bookings` + daily-summary at 20:30 IST | 1 day → 1 hour |
| Evening | GitHub Environments: `production` with required reviewer → manual promote from preview | After auto-deploy danger → 30 min |
| Evening | Full pipeline test: push → all green → preview deploy → verify → manual promote | Scattered → 1 hour |

**Day 11 output:** CI runs all gates. Preview deploy works. Manual promote to production.

---

### Day 12 — Data Protection & Compliance

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | DPDP: data retention settings table with per-key configurable retention periods | After compliance panic → 2 hours |
| Morning | DPDP erase flow: 3-day grace → access revoked → admin purge day 3-30 → auto-purge day 30 | After DPDP fixes → 3 hours |
| Afternoon | `anonymize_booking_pii(uuid)` RPC: redact name→REDACTED, phone→REDACTED, address→null | After DPDP fixes → 1 hour |
| Afternoon | DB RLS: REVOKE anon/authenticated EXECUTE on DPDP RPCs, GRANT service_role only | After DPDP fixes → 30 min |
| Afternoon | Test DPDP flow: request deletion → verify grace period → purge → verify PII gone, transaction rows kept | After DPDP fixes → 1 hour |
| Evening | Cookie consent: GDPR/DPDP compliant, `contentVisibility: "auto"` to not steal LCP | 1 day → 1 hour |
| Evening | Privacy policy update: DPDP Act 2023 compliance language | 1 day → 1 hour |

**Day 12 output:** DPDP compliant. Erasure works. De-identified transaction rows preserved.

---

### Day 13 — Production Readiness

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | 10-point launch readiness audit: build warnings, env cross-check, API route auth coverage, dead imports, DB validations, Clerk middleware coverage, console.log audit, CSP domains, rate limits, mobile responsive | After bugs shipped → 2 hours |
| Morning | Env var final check: `.env.example` has every variable, Vercel has all set, no name mismatches, Sensitive flags match | After namespace outage → 30 min |
| Morning | Cashfree: switch sandbox → production keys, verify `CASHFREE_ENV=production`, test a ₹1 transaction | Ad-hoc → 1 hour |
| Afternoon | MSG91: verify WhatsApp templates approved, sender number integrated | Ad-hoc → 1 hour |
| Afternoon | Clerk: verify custom domain DNS resolves, Turnstile CAPTCHA works | Ad-hoc → 30 min |
| Afternoon | Supabase: run `db lint`, verify RLS state, check plan limits (PITR, auto-pause) | After production → 30 min |
| Evening | Full smoke test on production preview: signup → book → pay → staff dispatch → collect → report → patient sees report | Never done in one pass → 2 hours |
| Evening | Load test: 60 concurrent visitors with Puppeteer, verify no crashes, rate limits hold | Ad-hoc → 1 hour |

**Day 13 output:** Production ready. Every external service verified. Smoke tested end-to-end.

---

### Day 14 — Launch

| Time | Task | Actual Time (original) |
|------|------|----------------------|
| Morning | Deploy to production: manual promote from preview → Vercel prod | Auto-deploy (dangerous) → 30 min |
| Morning | Verify production: DNS resolves, SSL valid, Clerk loads, DB connected, payments work | Ad-hoc → 1 hour |
| Morning | Sentry: verify errors being received, release tracked, source maps uploaded | After Sentry break → 30 min |
| Afternoon | Monitor: watch Sentry for new errors, Vercel logs for 500s, Cashfree for payment errors | Ad-hoc → ongoing |
| Afternoon | Final checklist: booking works → payment works → WhatsApp received → admin sees booking → staff can act | Scattered → 2 hours |
| Afternoon | Write `learned.md`: everything wrong, everything learned, taste preferences captured | This document → 2 hours |
| Evening | Git tag `v1.0.0`, freeze `main` branch | Not done → 5 min |
| Evening | Handoff: admin credentials, staff training guide, ops runbook | Not done → 2 hours |

**Day 14 output:** Launched. Monitoring. Learned. Handoff complete.

---

### 2-Week Timeline vs Actual 2 Months

| Phase | 2-Week Days | Actual Time | What Would Have Saved the Time |
|-------|------------|-------------|-------------------------------|
| Foundation + Schema | Day 1 | ~1 week | Design schema on paper first. Env validation from day zero. Phone normalizer before any code. |
| Authentication | Day 2 | ~2 weeks | Native `useSignIn()`, not Clerk iframe. DNS before Clerk config. CSP from start. `@clerk/testing` from start. |
| Core Booking Flow | Day 3 | ~2 weeks | E2E auth harness before feature code. `E2E_TEST_MODE` from day one. |
| Payment Integration | Day 4 | ~2 weeks | DB-first anchoring from start. Sandbox testing before prod. `timingSafeEqual` from start. |
| Staff + Admin | Day 5 | ~2 weeks | Verify DB schema supports features BEFORE building UI. One canonical auth guard. |
| Notifications | Day 6 | ~1 week | Validate payloads before sending. Log payloads in dev. Env var naming from `.env.example`. |
| Profile + UX | Day 7 | ~1 week | One canonical formatter. Profile page built after auth is solid. |
| Security | Day 8 | ~1 week | Rate limiting fail-closed from start. CSP from day one. No PII in logs from day one. |
| Testing | Day 9 | ~2 weeks | Jest + e2e + a11y + LHCI wired into CI from day one. Tests alongside feature code. |
| Design Polish | Day 10 | ~2 weeks | One design decision, documented. Theme tokens from start. Typography via next/font. |
| CI/CD | Day 11 | ~1 week | Single CI file from start. Preview deploy before production. Manual promote gate. |
| DPDP Compliance | Day 12 | ~1 week | Retention + erasure designed alongside schema. Not retrofitted. |
| Production Readiness | Day 13 | ~1 week | Launch audit checklist before every deploy. Smoke test end-to-end. |
| Launch | Day 14 | ~3 days | Manual promote. Monitor. Handoff docs. |
| **TOTAL** | **14 days** | **~2 months** | **8x faster by avoiding rework** |

---

### Root Causes of the 8x Slowdown

1. **No schema design review → 5 bugs, 2 rewrites.** Designing enums, FKs, and column names on paper for 2 hours would have saved 2 weeks of bug fixes.
2. **No canonical normalizers → 5 bugs, repeated fixes.** `lib/phone.ts` took 20 minutes to write. Fixing phone format bugs took 3+ days.
3. **E2e tests were fake → zero coverage.** Building the auth harness on Day 2 instead of Day 90 would have caught redirect loops, metadata issues, and auth bugs before they shipped.
4. **Building UI without verifying DB support.** Staff dashboard, cancellation, dispatch — all built against columns that didn't exist. Verify schema FIRST.
5. **Trusting phase docs "Done" marks.** Every feature was marked complete before adversarial verification. Read code, not docs.
6. **Fixing bugs one at a time instead of root cause.** Phone format, enum values, env vars — each was a symptom of a deeper problem. Fix the root, not the symptom.
7. **Not running tests in CI.** Jest caught enum mismatches. It wasn't in CI, so they shipped.
8. **Over-optimizing before things worked.** ShaderGradient removal, font swaps, design tokens — done while payments and WhatsApp were broken. Fix functionality first.

## 7. ARCHITECTURE DECISIONS THAT HELD UP

| Decision | Why It Was Right |
|----------|-----------------|
| **Modular monolith (not microservices)** | Single Next.js app on Vercel. Premature for a single low-volume diagnostic lab. Every split would be tech debt. |
| **Supabase + Clerk (not custom auth)** | Clerk handles auth edge cases (password reset, MFA, device management). Supabase handles relational data. Custom auth would be 1000+ lines of untested security code. |
| **Service-role DB access (not RLS)** | Next.js API routes are the monolithic security layer. RLS policies are vestigial. Correct for single-tenant lab. |
| **WhatsApp-only patient comms (no email)** | Avoids encrypting/emailing health reports + secure-link burden. Single channel simplifies compliance. |
| **Zod for all API payload validation** | Runtime type safety, strips unrecognized properties, standardized error format. Catch-all for injection + format bugs. |
| **DB-first payment anchoring** | Write the row, then call the gateway. Two racing confirmation paths (browser + webhook) both call atomic RPC. Idempotent. |
| **DPDP: anonymize PII, keep transaction rows** | Compliance non-negotiable for Indian healthcare. Never hard-delete bookings or payments. PII redacted, rows de-identified. |
| **Dark-glass theme (single mode, no toggle)** | One theme to maintain. No light/dark CSS duplication. No CSS variable explosion. |
| **Archivo + Inter + JetBrains Mono typography** | Characterful display face (Archivo) for headings, legible body (Inter) for elderly users, monospace (JetBrains Mono) for numeric authority. |
| **Preview → manual promote deploy gate** | Auto-deploy on green was too dangerous. Now: green CI → Preview deploy → Sid reviews → manual promote. |

---

## 8. STATS SUMMARY

| Metric | Count |
|--------|-------|
| Total git commits | 427 |
| Taste preferences learned | 120 |
| Bugs fixed (all severity) | 42+ |
| Critical bugs (broke money/security/data) | 5 |
| High-severity bugs | 12 |
| Security vulnerabilities found | 17 |
| Skills available | 45+ |
| Skills actively used | 8+ |
| Documentation files | 60+ |
| Graphify code nodes | 165 |
| Tests (green) | 132 |
| E2E tests (green) | 39 |
| External dependencies | 7 (Clerk, Supabase, Cashfree, MSG91, Resend, Sentry, Turnstile) |
| Lighthouse CI URLs audited | 10 |
| Performance thresholds | 14 |

---

## 9. REMAINING WEAK POINTS (Still in the Codebase)

> These are issues found during the final codebase scan on 2026-07-04. Not fixed yet.

### 9.1 — API Routes With No Zod Input Validation

These routes accept user input directly with `await request.json()` without Zod parsing — vulnerable to malformed input, injection, and type confusion:

| Route | Risk | Action |
|-------|------|--------|
| `app/api/booking-lookup/route.ts` | **HIGH** — PII endpoint. Accepts `booking_code` + `phone` from raw JSON, no schema. Has rate limiting but no input validation. | Add Zod schema with phone format + booking_code length constraints |
| `app/api/home-collection-slots/route.ts` | **LOW** — GET-only, no user input | Could add Zod for query params but low risk |
| `app/api/admin/booking-history/route.ts` | **LOW** — admin-only, reads booking_id from searchParams | Add Zod for booking_id UUID validation |
| `app/api/admin/mark-collected/route.ts` | **MEDIUM** — accepts `booking_id` + `collected_at` from raw body | Add Zod schema with UUID + ISO datetime validation |
| `app/api/admin/mark-paid/route.ts` | **MEDIUM** — accepts `booking_id` + `amount` + `payment_mode` from raw body | Add Zod schema. PaymentMode enum must be validated. |
| `app/api/health/route.ts` | **NONE** — GET-only, no input | Fine as-is |

### 9.2 — Missing Unit Tests for API Routes

16 out of 32 API routes have zero unit test coverage. These routes handle PII, payments, staff actions, cron jobs, and webhooks:

| Untested Route | Risk | What It Does |
|----------------|------|-------------|
| `api/booking-lookup/route.ts` | **HIGH** | Returns patient name, age, gender, test list — PII endpoint with rate limiting but no Zod. |
| `api/patient/bookings/route.ts` | **MEDIUM** | Returns patient's booking history |
| `api/patient/profile/route.ts` | **MEDIUM** | GET + PATCH patient profile data |
| `api/staff/update-status/route.ts` | **MEDIUM** | Staff dispatches/collects/reports — changes booking state |
| `api/account/delete-cancel/route.ts` | **MEDIUM** | Cancels data deletion request |
| `api/account/export/route.ts` | **LOW** | Exports patient data (GDPR/DPDP) |
| `api/admin/booking-history/route.ts` | **LOW** | Admin reads audit trail |
| `api/admin/mark-collected/route.ts` | **MEDIUM** | Admin marks sample collected — mutates booking |
| `api/admin/mark-paid/route.ts` | **MEDIUM** | Admin marks payment as paid — mutates payment + booking |
| `api/cron/daily-summary/route.ts` | **LOW** | Sends daily summary email to admin |
| `api/cron/dpdp/route.ts` | **MEDIUM** | Auto-purges expired DPDP deletion requests — deletes data |
| `api/cron/expire-bookings/route.ts` | **LOW** | Cancels stale pending bookings |
| `api/health/route.ts` | **LOW** | Health check endpoint |
| `api/home-collection-slots/route.ts` | **LOW** | Returns available home collection slots |
| `api/webhooks/clerk/route.ts` | **MEDIUM** | Handles Clerk user deactivation events |
| `api/auth/link-booking/route.ts` | **LOW** | Links a booking to a logged-in user's profile |

### 9.3 — `any` Types Bypass Type Safety

74 `any` type casts exist across 23 files. Key high-risk areas:

| File | Count | Risk |
|------|-------|------|
| `app/api/bookings/route.ts` | 27 | **HIGH** — Core booking creation. `any` on supabase client, request body, test items, slot times, booking insert result. Every `any` here is a potential runtime type error. |
| `lib/email.ts` | 12 | **MEDIUM** — All catch blocks use `error: any`. Function parameter typed as `options: any`. |
| `app/book/booking-flow.tsx` | 5 | **MEDIUM** — `packages[]`, `tests[]`, selected items all typed `any`. TypeScript provides zero safety on the booking wizard. |
| `lib/booking-rules.ts` | 4 | **MEDIUM** — `supabase: any` parameter on all functions. The Supabase client has a typed interface — this bypasses it. |
| `app/admin/tests/actions.ts` | 2 | **MEDIUM** — `bulkImportTests(rows: any[])` accepts any data structure |
| `app/api/webhooks/cashfree/route.ts` | 1 | **LOW** — `booking_items.map((i: any) => i.item_name)` |

### 9.4 — Hardcoded Phone Number in 16 Places

`9760700140` appears in 12 files (16 occurrences total). While `lib/site-config.ts` defines `CONTACT_PHONE`, most UI files use direct string literals instead of importing the constant:

**Files using direct hardcoded `tel:+919760700140`:**
- `app/layout.tsx`, `app/not-found.tsx`, `app/book/payment-return/page.tsx`, `app/book/payment-return/error.tsx`, `app/booking/error.tsx`, `app/profile/error.tsx`, `app/book/error.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/refund-policy/page.tsx`

**Files using direct hardcoded WhatsApp:**
- `app/book/components/booking-confirmation.tsx`, `app/refund-policy/page.tsx`

**Why this matters:** If the phone number changes, you must update 12 files. Should all import from `lib/site-config.ts`.

### 9.5 — Google Maps CID Placeholder

`app/layout.tsx:173`: `'https://www.google.com/maps?cid=CHANGEME'` — This is the structured data for the lab's physical location. It's been `CHANGEME` since the site was built. SEO penalty: Google uses this for local business ranking.

**Fix:** Find the actual Google Maps CID for Sindhey Pathology and replace.

### 9.6 — `bookings/route.ts` Is 802 Lines

The booking creation API route is the single biggest file in `app/api/`. It handles:
- Input validation (manual, uses Zod schema)
- Date validation (closed dates, same-day cutoff, future-window cap)
- Test/package validation (UUID lookups, code lookups, price calculations)
- Patient ID resolution (existing profile vs new guest)
- Slot capacity checking (per-slot, per-phone concurrent pending cap)
- DB insertion (booking + booking_items + history)
- Side effects (WhatsApp notification, email notification)
- Response formatting

**Risk:** A single change to any part of booking logic requires reading the full 802-line file. High cognitive load for maintenance.

### 9.7 — 211 `console.log` Statements in Production Code

54 files contain production `console.log/error/warn/info`. Key offenders:

| File | Count | Notes |
|------|-------|-------|
| `api/webhooks/cashfree/route.ts` | 26 | 473 lines, mostly fire-and-forget `.catch(console.error)` for notifications |
| `lib/whatsapp.ts` | 24 | Payload dumps, phone numbers in logs, template names |
| `lib/email.ts` | 11 | All fire-and-forget notification failures |
| `api/auth/send-otp/route.ts` | 7 | OTP limits, DB errors |
| `api/admin/upload-report/route.ts` | 7 | Upload, storage, history errors |
| `api/admin/cancel-booking/route.ts` | 7 | Refund, update, history errors |

**Risk:** WhatsApp payloads in `whatsapp.ts` log full MSG91 request bodies including phone numbers and template content. OTP logs in `send-otp` reveal rate-limit state. Most are legitimate error logging but could benefit from structured logging (JSON format, severity levels, PII redaction).

### 9.8 — WhatsApp Namespace env Var Is Optional

`lib/env.ts:21`: `MSG91_WHATSAPP_NAMESPACE: z.string().optional()` — Marked optional, but the send-otp routes check for it and log warnings if missing. Without it, WhatsApp templates fail. Should be required (`.min(1)`) since WhatsApp is the primary patient communication channel.

### 9.9 — No Caching on Test Catalog

The `/tests` page fetches the full test/package catalog from Supabase on every request. `home-collection-slots` also queries fresh every time. These are read-heavy, low-change endpoints that could benefit from:
- `stale-while-revalidate` caching (Vercel Edge Config or Supabase cache)
- HTTP `Cache-Control` headers
- Static generation with ISR for the test catalog page

### 9.10 — E2E Blind Spot: Clerk Anti-Bot

Documented in ADR-0007 but worth restating: Clerk's captcha widget and Cloudflare Turnstile are structurally impossible for Playwright to interact with. Any auth flow that touches these widgets must be smoke-tested manually before production deploy. The e2e suite's auth success is achieved via `@clerk/testing` + `E2E_TEST_MODE`, which bypasses the actual CAPTCHA flow. There is no automated test covering: "real user sees captcha → completes it → signs in."

### 9.11 — Staff Authorization: No Booking Ownership Model

Any staff member can dispatch/collect/report any booking. There's no concept of "assigned staff." If two staff members dispatch the same booking simultaneously, there's a race condition. The `update-status` route's optimistic concurrency control (checking current status before update) helps, but there's no row-level lock on the booking during the read-check-write window.

### 9.12 — `crypto.timingSafeEqual` Only in Webhook Handlers

Webhook HMAC verification uses `timingSafeEqual` correctly. But the OTP verification routes compare `hashedOtp === hash` directly — these should also use constant-time comparison. OTP codes are short (6 digits), making them vulnerable to timing-based brute force.

### 9.13 — No Input Sanitization on Admin Search

`api/admin/leads/route.ts` and `api/admin/users/actions.ts` accept search queries that are passed to Supabase `.ilike()` filters. While PostgREST filter injection was fixed (commas/operators sanitized), SQL `%` and `_` wildcards in user input could cause unintended LIKE pattern matching.

### 9.14 — Reschedule API Exists But No UI

The reschedule API route (`api/bookings/reschedule/route.ts`) is fully implemented, tested, and works. But there's no button in the UI for patients or staff to trigger it. This is intentional (marked as "unwired to UI" in docs), but it's dead code until wired.

### 9.15 — Supabase Hobby Plan Risk

The project is on Supabase's free tier. If the project goes inactive for 7 days, Supabase pauses the database. No PITR (point-in-time recovery). If someone accidentally drops a table or deletes rows, there's no backup. This is an operational risk, not a code risk.
