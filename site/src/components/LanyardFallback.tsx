"use client";

// Static fallback card — renders when WebGL fails, reduced-motion is preferred,
// or the Lanyard physics component throws. Uses design tokens: monogram, orange
// band, mono name. NOT a screenshot placeholder.

export default function LanyardFallback({ frontImage: _frontImage }: { frontImage: string }) {
  return (
    <div className="lanyard-wrapper">
      <div
        className="w-[280px] mx-auto rounded-[--r-md] border border-[--line] overflow-hidden select-none"
        style={{ background: "var(--surface)" }}
      >
        {/* Orange band — top accent strip */}
        <div className="h-16" style={{ background: "var(--accent)" }} />

        {/* Monogram — large SS */}
        <div className="py-10 px-6 flex flex-col items-center gap-4">
          <span
            className="font-mono text-6xl font-bold leading-none"
            style={{ color: "var(--text)" }}
          >
            SS
          </span>

          {/* Name + role */}
          <div className="text-center">
            <p
              className="font-display text-lg leading-tight tracking-[-0.02em]"
              style={{ color: "var(--text)" }}
            >
              Siddharth Singh
            </p>
            <p
              className="font-mono text-[11px] uppercase tracking-[0.08em] mt-1"
              style={{ color: "var(--accent)" }}
            >
              AI Backend Engineer
            </p>
          </div>
        </div>

        {/* Bottom accent band */}
        <div className="h-2" style={{ background: "var(--accent)" }} />
      </div>
    </div>
  );
}
