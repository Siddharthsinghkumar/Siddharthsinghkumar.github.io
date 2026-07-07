import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function Section({ children, className = "", id }: SectionProps) {
  return (
    <section
      id={id}
      className={`px-4 py-16 md:py-24 lg:py-[96px] ${className}`}
    >
      <div className="mx-auto max-w-[1200px] relative z-[20]">{children}</div>
    </section>
  );
}
