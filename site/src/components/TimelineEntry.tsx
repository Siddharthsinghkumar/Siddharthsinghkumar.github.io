import Link from "next/link";
import type { ReactNode } from "react";

interface TimelineEntryProps {
  period: string;
  role: string;
  href?: string;
  children: ReactNode;
}

export default function TimelineEntry({
  period,
  role,
  href,
  children,
}: TimelineEntryProps) {
  const isExternal = href?.startsWith("http");

  const content = (
    <div className="relative pl-8 pb-10 border-l border-[--line] last:border-l-0 last:pb-0 group">
      <span className="absolute left-[-5px] top-1.5 w-[9px] h-[9px] rounded-full bg-[--accent] transition-transform group-hover:scale-150" />
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--accent] mb-1">
        {period}
      </p>
      <h3 className="font-display text-lg text-[--text] mb-1 group-hover:text-[--accent] transition-colors">
        {role}
        {href && (
          <span className="inline-block ml-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[--muted] group-hover:text-[--accent] transition-colors">
            {isExternal ? "↗" : "→"}
          </span>
        )}
      </h3>
      <p className="text-[--muted] text-sm leading-relaxed max-w-[68ch]">
        {children}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="block no-underline link-pulse-hover link-pulse-auto"
      >
        {content}
      </Link>
    );
  }

  return content;
}
