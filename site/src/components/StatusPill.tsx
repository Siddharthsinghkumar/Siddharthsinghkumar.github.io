type StatusLabel =
  | "SHIPPED"
  | "RUNNING LOCAL"
  | "IN DEVELOPMENT"
  | "RESEARCH"
  | "CONCEPT"
  | "HARDWARE · PUBLISHED"
  | "SYSTEMS · SECURITY"
  | "STORAGE · FORENSICS"
  | "SHIPPED · CLIENT WORK";

const statusColorMap: Record<string, string> = {
  SHIPPED: "--ok",
  "SHIPPED · CLIENT WORK": "--ok",
  "RUNNING LOCAL": "--accent",
  "IN DEVELOPMENT": "--warn",
  RESEARCH: "--muted",
  CONCEPT: "--muted",
  "HARDWARE · PUBLISHED": "--muted",
  "SYSTEMS · SECURITY": "--muted",
  "STORAGE · FORENSICS": "--muted",
};

const shouldPulse = (status: string) => status === "RUNNING LOCAL";

interface StatusPillProps {
  status: StatusLabel;
  className?: string;
}

export default function StatusPill({ status, className = "" }: StatusPillProps) {
  const colorVar = statusColorMap[status] || "--muted";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] ${className}`}
      style={{ color: `var(${colorVar})` }}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${shouldPulse(status) ? "animate-[pulse-dot_2s_ease-in-out_infinite]" : ""}`}
        style={{ backgroundColor: `var(${colorVar})` }}
      />
      {status}
    </span>
  );
}
