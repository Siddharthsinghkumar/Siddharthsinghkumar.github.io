# T14 — Q&A + Plan

## All 18 Questions Answered

### Q1: Loading screen not showing in Chrome
**Root cause:** `sessionStorage.getItem("intro-shown")` blocks the overlay on repeat visits. Chrome's faster WebGL init means `signalEngineReady()` fires within 16ms, overlay dismisses before visually noticeable. Firefox's slower init lets it stay visible ~80ms.
**Fix needed:** Force loading screen to show every time until engine signals ready. Remove sessionStorage early-exit for dev builds, or restructure to always render overlay until ready promise resolves regardless of browser speed.

### Q2: Stage rings at waypoint B — make visible
**Current:** 6 orange octahedrons at radius 2.6, `color = #FF5C1A`, size 0.22. They counter-rotate and pulse sequentially.
**Temp fix:** Make them white, 3x bigger, full opacity so Sid can see them. Comment out old values, don't remove.

### Q3: Satellite at waypoint C — make visible
**Current:** Position [-8, 0.8, 3.5]. Central router octahedron 0.49 radius, 2 orbiting nodes at 0.18 radius, wireframe torus, particle arc. Orange + white.
**Temp fix:** Make everything white, 2-3x bigger, full opacity. Comment old code.

### Q4: Nav name doesn't reload from hero page
**Root cause:** Next.js `<Link href="/">` on current route `/` = no-op. Next.js won't navigate to the same route.
**Fix:** Use plain `<a href="/">` for the home link, or `router.refresh()` + `window.scrollTo(0,0)`.

### Q5: (Answered same as Q3)

### Q6: Waypoint D purpose is weak
**Root cause:** Timeline entries are static text cards. No links, no click targets. No way to "view details." Visitor sees 4 dot-text rows and has zero interaction.
**Fix:** Add clickable links to TimelineEntry component — each entry gets an `href` prop. Link to relevant pages (Sindhey → external site, Firefighting Robot → GitHub/projects, etc.)

### Q7: Two pulsating lights at bottom in waypoint D
**Root cause:** Satellite still visible (p 0.48–0.72 includes waypoint D). Camera at (0.5, 2.5, 9) looking down, satellite at [-8, 0.8, 3.5] appears as two orbiting dots below-left of core. Looks like a UI bug/laser hitting core.
**Fix:** Hide satellite during waypoint D. Change satellite visibility range from p 0.28–0.72 to p 0.28–0.48 (waypoint C only).

### Q8: TimelineEntry needs clickable links
**Root cause:** `TimelineEntry.tsx` has no `href` prop. Component accepts only `period`, `role`, `children`.
**Fix needed:** Add `href` prop to TimelineEntry. Each entry on home page gets a real link.

### Q9: Waypoint E — no button visible, remove slow pulse
**Root cause:** The "Know Me →" button might be scrolled past or not visible. Core uses 8-second slow breath transitioning to 3-second fast pulse at E.
**Fix:** Make core pulse always fast (3-second cycle), no slow 8-second phase. Ensure CTA button is visible.

### Q10: PaperTexture not being used correctly
**Root cause:** Currently using `PaperInkLoader` (custom WebGL ink shader) in hero sections only. Not using `@paper-design/shaders-react`'s `PaperTexture` component at all. The custom shader renders per-section, not full-page.
**Fix:** Switch to `@paper-design/shaders-react` `PaperTexture` with background image from download folder. Apply as full-page background, not just hero-top.

### Q11: Grey color on IPS displays
**Root cause:** `--bg = rgb(11,11,13)` is near-black but not pure black. IPS panels show this as dark grey due to lower contrast ratios. On OLED (phone), it renders as true black — but phone isn't rendering 3D elements at all.
**Fix:** Set `background-color` to pure `#000000` for OLED. The 3D engine rendering issue on mobile is separate.

### Q12: No orange halo on cursor — stationary or moving
**Root cause:** CustomCursor ring + dot have `border-[--accent]/50` and `bg-[--accent]`. The PaperInk shader adds orange ink trail on pointermove. Together they create the halo.
**Fix:** Remove/disable the PaperInk ink trail. Keep CustomCursor minimal — just the dot, no ring, or transparent ring.

### Q13: Link pulse behavior
**Hero page links:** Should pulse infinitely with long gap (e.g., every 4-5 seconds).
**Subpage links:** Should pulse on hover only.
**Implementation:** Create two CSS classes — `.link-pulse-hero` (infinite, long gap) and `.link-pulse-hover` (hover-triggered).

### Q14: Contact parts still exist after KnowMe
**Root cause:** Footer still renders on every page via `layout.tsx`. It has full contact section.
**Fix:** Remove the duplicate contact CTA from Footer since KnowMe handles it. Keep Footer minimal — just copyright/build line.

### Q15: Cross-link buttons — left aligned, wrong text
**Fix:** Replace "Travel Planner Agent →" button with "Want your own version?" → `mailto:siddharthsingh8418@gmail.com?subject=Travel%20Planner%20Agent%20Inquiry`. Move to right side. Same for Prospect page.

### Q16: Travel Planner → links to Prospect
**Current:** Cross-link direction Prospect ↔ Travel Planner.
**Your request:** Rotate arrow 180° (pointing right is fine), move button to right side, add "Want your own version?" button to left side. Keep the Prospect cross-link, just reposition.

### Q17: "Flagships are running daily" — only 2
**Root cause:** The text references "flagships" plural (Prospect + Travel Planner). Only 2 are shown — those ARE the two flagships. The text is accurate.
**Your concern:** Are there more flagships? Currently only 2. If you want to list more, they need to be added.

### Q18: KnowMe page issues
- **Text centered → left:** Remove `mx-auto` from text container
- **Card too small → 1.5x:** Change `scale={2.25}` to `scale={3.375}` in Lanyard.tsx
- **Card not interactive → already fixed:** `pointer-events-none` removed in T13
- **Static background → dynamic FlutedGlass:** Replace CSS atmosphere with `FlutedGlass` component from `@paper-design/shaders-react` across the full page
- **Background images:** Use test images from download folder everywhere images can go
- **No horizontal line separator:** Remove `border-t border-[--line]` between sections on KnowMe

---

## Summary of Changes Needed

### Phase 1: Dev-only temp visibility (for Sid to see 3D elements)
1. StageNodes → white, 3x bigger, full opacity (comment old)
2. Satellite → white, 2-3x bigger, full opacity (comment old)

### Phase 2: 3D Engine fixes
3. Satellite visibility: restrict to p 0.28–0.48 (waypoint C only, not D)
4. Core pulse: remove 8-second slow breath, use 3-second fast pulse always
5. Phone 3D rendering: investigate why no 3D on mobile

### Phase 3: Navigation fixes
6. Nav name: plain `<a href="/">` so it reloads from hero page
7. Loading screen: show every time until engine ready (remove sessionStorage race)

### Phase 4: Link pulse behavior
8. Hero links: infinite pulse with 5s gap
9. Subpage links: hover-triggered pulse

### Phase 5: PaperTexture replacement
10. Install/use `@paper-design/shaders-react` PaperTexture for full-page backgrounds
11. Use test images from download folder as background images
12. Apply to all subpages (Prospect, Travel Planner, Projects, KnowMe)

### Phase 6: TimelineEntry + Waypoint D
13. Add `href` prop to TimelineEntry
14. Add real links to all 4 timeline entries
15. Waypoint D purpose: add interactive elements

### Phase 7: Subpage button fixes
16. Prospect bottom: "Want your own version?" (left) + "Travel Planner Agent →" (right)
17. Travel Planner bottom: "Want your own version?" (left) + "Prospect →" (right)
18. Both Want buttons → mailto with project-specific subject

### Phase 8: KnowMe page
19. Text left-aligned
20. FlutedGlass background (full page, not just hero)
21. Card 1.5x bigger
22. Remove section dividers between bio and contact parts
23. Add test images wherever images can go

### Phase 9: Cursor + Footer cleanup
24. Remove orange cursor halo (disable PaperInk trail, minimal cursor)
25. Remove duplicate contact CTA from Footer (keep build line only)

### Phase 10: Mobile
26. Fix mobile rendering (3D not loading, background color pure black)
27. Investigate cross-origin HMR warning (add allowedDevOrigins)
