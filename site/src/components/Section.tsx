import type { ReactNode, HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
}

export default function Section({ children, className = "", ...rest }: SectionProps) {
  return (
    <section
      className={`px-4 py-16 md:py-24 lg:py-[96px] ${className}`}
      {...rest}
    >
      <div className="mx-auto max-w-[1200px] relative z-[20]">{children}</div>
    </section>
  );
}
