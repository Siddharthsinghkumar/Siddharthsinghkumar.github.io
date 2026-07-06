# AGENTS.md — Sid's Portfolio Website

All responses must start with my name. My name is **Sid**.

## Knowledge Graph

| File | Absolute Path | What It Contains |
|------|--------------|-----------------|
| **CONTEXT.md** | `/home/sidd/project/freelance/portfolio-website/CONTEXT.md` | ⭐ SOURCE OF TRUTH — all site facts (interview 2026-07-04): purpose, audience, Prospect system, flagships, constraints |
| **COPY.md** | `/home/sidd/project/freelance/portfolio-website/COPY.md` | Every page's copy, verified-claims register, SEO targets |
| **DESIGN.md** | `/home/sidd/project/freelance/portfolio-website/DESIGN.md` | Brand kit (Graphite + Signal Orange), tokens, components, motion, budgets, decision log |
| **CLAUDE.md** | `/home/sidd/project/freelance/portfolio-website/CLAUDE.md` | Build rules incl. the component-donor rule (skeleton/skin/words) |
| **EXECUTION-PLAN.md** | `/home/sidd/project/freelance/portfolio-website/EXECUTION-PLAN.md` | T0–T7 executor plan with done-criteria, gates, kickoff prompt |
| **docs/learned.md** | `/home/sidd/project/freelance/portfolio-website/docs/learned.md` | 973-line master learnings from sindhey-website: 23 mistakes, 46 lessons, 15 weak points, 14-day roadmap |
| **reference-skill.md** | `/home/sidd/project/freelance/portfolio-website/reference-skill.md` | 84 skills, MCPs, CLIs & frameworks cataloged from sindhey-website |
| **howtodeploy.md** | `/home/sidd/project/freelance/portfolio-website/howtodeploy.md` | Coolify self-hosted free deployment strategy |
| **local-resume-references.md** | `/home/sidd/project/freelance/portfolio-website/local-resume-references.md` | Sid's resume details for portfolio content |
| **portfoli-card.md** | `/home/sidd/project/freelance/portfolio-website/portfoli-card.md` | React Bits portfolio card component integration |
| **profile-pic-card.md** | `/home/sidd/project/freelance/portfolio-website/profile-pic-card.md` | React Bits Lanyard component integration |
| **reference-website-1.md** | `/home/sidd/project/freelance/portfolio-website/reference-website-1.md` | igloo.inc reference site analysis |
| **reference-website-2.md** | `/home/sidd/project/freelance/portfolio-website/reference-website-2.md` | Second reference site analysis |
| **reference-website-3.md** | `/home/sidd/project/freelance/portfolio-website/reference-website-3.md` | Third reference site analysis |
| **reference-website-4.md** | `/home/sidd/project/freelance/portfolio-website/reference-website-4.md` | Glyphic reference site analysis |
| **reference-website-5.md** | `/home/sidd/project/freelance/portfolio-website/reference-website-5.md` | Raycast reference site analysis |
| **ui-component-1.md** | `/home/sidd/project/freelance/portfolio-website/ui-component-1.md` | Cool UI components to use |
| **ui-component-2.md** | `/home/sidd/project/freelance/portfolio-website/ui-component-2.md` | React Bits TextPressure component |
| **ui-component-3.md** | `/home/sidd/project/freelance/portfolio-website/ui-component-3.md` | React Bits GridMotion component |
| **references_research_paper/AI_Web_Design.md** | `/home/sidd/project/freelance/portfolio-website/references_research_paper/AI_Web_Design.md` | AI-driven web design research |
| **references_research_paper/Color_Perception.md** | `/home/sidd/project/freelance/portfolio-website/references_research_paper/Color_Perception.md` | Color models for human perception |
| **references_research_paper/Immersive_Web_Design.md** | `/home/sidd/project/freelance/portfolio-website/references_research_paper/Immersive_Web_Design.md` | Ethical immersive web design |
| **references_research_paper/Microinteractions_UI.md** | `/home/sidd/project/freelance/portfolio-website/references_research_paper/Microinteractions_UI.md` | Squidgets: sketch-based microinteraction design |
| **references_research_paper/UX_Psychology.md** | `/home/sidd/project/freelance/portfolio-website/references_research_paper/UX_Psychology.md` | UX psychology & human-computer interaction |
| **references_research_paper/Web_Performance_UX.md** | `/home/sidd/project/freelance/portfolio-website/references_research_paper/Web_Performance_UX.md` | Web performance with battery-saver mode |

## MCP Servers

| MCP | Provider | Purpose |
|-----|----------|---------|
| **Supabase MCP** | Supabase | Database schema introspection, query execution, migration management |
| **Clerk MCP** | Clerk (via clerk-nextjs-skills) | Auth configuration, user management, session inspection |
| **Reform MCP** | Reform | Form generation and validation integration |
| **Vercel AI Gateway MCP** | Vercel (via ai-sdk-6-skills) | AI model routing and tool approval |
| **Sentry MCP** | Sentry | Error monitoring, release tracking, issue management |

## Rules

1. All responses must start with my name: **Sid**.
2. Read `docs/learned.md` before writing ANY code — every mistake from sindhey-website is documented there.
3. Read `reference-skill.md` for the full catalog of 84 skills, MCPs, CLIs, and frameworks available.
4. Research papers have `.pdf` copies — read `.md` summaries first, fallback to `.pdf` only if needed.
5. Reference websites (1-5) are design inspiration — mine for patterns, not copy.
6. UI component files (1-3) contain React Bits integration prompts — follow the exact prompt format.
7. Deploy via Coolify (self-hosted), not Vercel — see `howtodeploy.md`.
8. Commit each completed task separately with descriptive messages. Never mention any AI/agent (Claude, Deepseek, etc.) in commit messages. After all tasks complete, check `git status` to ensure nothing is left uncommitted and everything in `.gitignore` is properly ignored.
