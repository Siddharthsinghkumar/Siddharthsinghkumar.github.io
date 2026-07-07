delete commented-out `DataStream` JSX and associated `streamGroupRef` / `brightStreamIdx` opacity logic. Remove entirely. [site/src/components/engine/EngineCanvas.tsx]
delete commented-out `ePulse` / `eIntensity` / `baseBreathe` core breathing animation logic. Remove entirely. [site/src/components/engine/EngineCanvas.tsx]
delete commented-out `onScroll` listener block (`setScrolled(window.scrollY > 40)`). Remove entirely. [site/src/components/Nav.tsx]
yagni `isDecrypted` state and `direction` ("forward" | "reverse") in `DecryptedText.tsx`. `DecryptedText` is only used for one-way forward reveals on the hero page. Simplify to boolean `isAnimating`. [site/src/components/DecryptedText.tsx]

Net lines removable: ~85
Net dependencies removable: 0
