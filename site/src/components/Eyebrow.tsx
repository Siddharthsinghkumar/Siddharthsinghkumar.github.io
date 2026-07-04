interface EyebrowProps {
  children: string;
  className?: string;
}

export default function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <p
      className={`font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted] mb-3 ${className}`}
    >
      {children}
    </p>
  );
}
