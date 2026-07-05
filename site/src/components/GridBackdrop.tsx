"use client";

// Illuminated grid backdrop — concept from GridMotion donor (ui-component-3.md),
// built from scratch. CSS-first with pointer parallax. No gsap, no stock images.
// Tiles: real artifacts — OG thumbnail labels, SVG diagram crops, mono repo names,
// spec-sheet text blocks. All rendered inline, no external image loads.

import { useRef, useEffect, useState, useMemo, type ReactNode } from "react";
import manifest from "@/data/tiles-manifest.json";

function Tile({ children, index }: { children: ReactNode; index: number }) {
  return (
    <div
      className="flex items-center justify-center p-2 border border-[--line] rounded-[--r-sm]"
      style={{
        background: "var(--surface-2)",
        opacity: 0.22,
        aspectRatio: "1",
      }}
    >
      {children}
    </div>
  );
}

function ImageTile({ src, index }: { src: string; index: number }) {
  return (
    <div
      className="relative overflow-hidden rounded-[--r-sm] border border-[--line]"
      style={{ opacity: 0.33, aspectRatio: "1" }}
    >
      <img
        src={src}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "blur(8px)" }}
        loading="lazy"
      />
      <div
        className="absolute inset-0"
        style={{ background: "hsl(17 100% 55% / 0.15)", mixBlendMode: "overlay" as React.CSSProperties["mixBlendMode"] }}
      />
    </div>
  );
}

const generatedTiles: ReactNode[] = [
  // OG thumbnails
  <span key="og-home" className="font-mono text-[8px] text-[--accent] tracking-[0.08em] text-center leading-tight">OG<br/>HOME</span>,
  <span key="og-prospect" className="font-mono text-[8px] text-[--accent] tracking-[0.08em] text-center leading-tight">OG<br/>PROSP</span>,
  <span key="og-tp" className="font-mono text-[8px] text-[--accent] tracking-[0.08em] text-center leading-tight">OG<br/>TRAVL</span>,
  // SVG crops (inline mini versions)
  <svg key="svg-scan" viewBox="0 0 32 16" className="w-full h-auto" aria-hidden="true">
    <rect x="1" y="3" width="6" height="10" rx="1" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
    <text x="4" y="10" fill="var(--accent)" fontSize="2">S</text>
    <line x1="8" y1="8" x2="11" y2="8" stroke="var(--accent)" strokeWidth="0.3" />
    <rect x="12" y="3" width="6" height="10" rx="1" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
    <text x="15" y="10" fill="var(--accent)" fontSize="2">E</text>
  </svg>,
  // Mono labels
  <span key="repo-sindhey" className="font-mono text-[8px] text-[--muted] tracking-[0.08em] text-center leading-tight">SINDHEY<br/>PATHOLOGY</span>,
  <span key="repo-fire" className="font-mono text-[8px] text-[--muted] tracking-[0.08em] text-center leading-tight">FIREFIGHT<br/>ROBOT</span>,
  <span key="repo-mtk" className="font-mono text-[8px] text-[--muted] tracking-[0.08em] text-center leading-tight">MTK<br/>UNLOCK</span>,
  <span key="repo-zfs" className="font-mono text-[8px] text-[--muted] tracking-[0.08em] text-center leading-tight">TRUENAS<br/>ZFS LAB</span>,
  // Spec sheet snippets
  <span key="spec-ship" className="font-mono text-[7px] text-[--ok] tracking-[0.08em] text-center leading-tight">SHIPPED<br/>CLIENT</span>,
  <span key="spec-run" className="font-mono text-[7px] text-[--accent] tracking-[0.08em] text-center leading-tight">RUNNING<br/>LOCAL</span>,
  <span key="spec-dev" className="font-mono text-[7px] text-[--warn] tracking-[0.08em] text-center leading-tight">IN<br/>DEVL</span>,
  <span key="spec-res" className="font-mono text-[7px] text-[--muted] tracking-[0.08em] text-center leading-tight">RESEARCH</span>,
  // Pipeline labels
  <span key="pipe-scan" className="font-mono text-[7px] text-[--accent] tracking-[0.08em] text-center leading-tight">SCAN</span>,
  <span key="pipe-extract" className="font-mono text-[7px] text-[--accent] tracking-[0.08em] text-center leading-tight">EXTRACT</span>,
  <span key="pipe-embed" className="font-mono text-[7px] text-[--accent] tracking-[0.08em] text-center leading-tight">EMBED</span>,
  <span key="pipe-match" className="font-mono text-[7px] text-[--accent] tracking-[0.08em] text-center leading-tight">MATCH</span>,
  <span key="pipe-gen" className="font-mono text-[7px] text-[--accent] tracking-[0.08em] text-center leading-tight">GENERATE</span>,
  <span key="pipe-del" className="font-mono text-[7px] text-[--accent] tracking-[0.08em] text-center leading-tight">DELIVER</span>,
  // Architecture SVG mini
  <svg key="svg-arch" viewBox="0 0 32 16" className="w-full h-auto" aria-hidden="true">
    <rect x="1" y="3" width="6" height="10" rx="1" fill="none" stroke="var(--muted)" strokeWidth="0.5" />
    <text x="4" y="10" fill="var(--muted)" fontSize="1.6">RTR</text>
    <line x1="8" y1="8" x2="11" y2="8" stroke="var(--accent)" strokeWidth="0.3" />
    <rect x="12" y="3" width="7" height="10" rx="1" fill="none" stroke="var(--warn)" strokeWidth="0.5" strokeDasharray="0.5" />
    <text x="15" y="10" fill="var(--warn)" fontSize="1.6">CKT</text>
  </svg>,
  <span key="k3s" className="font-mono text-[7px] text-[--muted] tracking-[0.08em] text-center leading-tight">k3s<br/>CLUSTER</span>,
  <span key="gpt" className="font-mono text-[7px] text-[--muted] tracking-[0.08em] text-center leading-tight">GRAFANA<br/>PROME</span>,
];

const COLS = 6;

export default function GridBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(true);

  const tiles = useMemo<ReactNode[]>(() => {
    const imageTiles: ReactNode[] = manifest.tiles.map((src, i) => (
      <ImageTile key={`img-${i}`} src={src} index={i} />
    ));
    const all = [...imageTiles, ...generatedTiles];
    return all;
  }, []);

  const ROWS = Math.ceil(tiles.length / COLS);

  useEffect(() => {
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (rmq.matches) { setEnabled(false); return; }
    const fine = window.matchMedia("(any-pointer: fine)");
    if (!fine.matches) { setEnabled(false); return; }

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      targetX = ((e.clientX / w) - 0.5) * 20;
      targetY = ((e.clientY / h) - 0.5) * 20;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.03;
      currentY += (targetY - currentY) * 0.03;
      setOffset({ x: currentX, y: currentY });
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const grid: ReactNode[] = [];
  for (let i = 0; i < manifest.tiles.length; i++) {
    grid.push(
      <ImageTile key={`img-${i}`} src={manifest.tiles[i]} index={i} />,
    );
  }
  for (let i = 0; i < generatedTiles.length; i++) {
    grid.push(
      <Tile key={`gen-${i}`} index={manifest.tiles.length + i}>
        {generatedTiles[i]}
      </Tile>,
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Radial mask: fade at section edges */}
      <div
        className="absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 50%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 50% at 50% 50%, black 30%, transparent 85%)",
        }}
      >
        {/* Accent glow behind gaps */}
        <div
          className="absolute inset-0 blur-[80px]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, hsl(17 100% 55% / 0.04), transparent 70%)",
          }}
        />

        {/* Grid of tiles */}
        <div
          className="grid gap-2 p-4 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            ...(enabled
              ? {
                  transform: `translate(${offset.x}px, ${offset.y}px)`,
                  transition: "transform 200ms ease-out",
                }
              : {
                  animation: "drift-grid 80s linear infinite",
                }),
          }}
        >
          {grid}
        </div>
      </div>
    </div>
  );
}
