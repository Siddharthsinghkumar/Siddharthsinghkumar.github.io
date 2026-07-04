import type { ReactNode } from "react";

interface TimelineEntryProps {
  period: string;
  role: string;
  children: ReactNode;
}

export default function TimelineEntry({
  period,
  role,
  children,
}: TimelineEntryProps) {
  return (
    <div className="relative pl-8 pb-10 border-l border-[--line] last:border-l-0 last:pb-0">
      {/* Dot */}
      <span className="absolute left-[-5px] top-1.5 w-[9px] h-[9px] rounded-full bg-[--accent]" />

      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--accent] mb-1">
        {period}
      </p>
      <h3 className="font-display text-lg text-[--text] mb-1">{role}</h3>
      <p className="text-[--muted] text-sm leading-relaxed max-w-[68ch]">
        {children}
      </p>
    </div>
  );
}
