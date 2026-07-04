import Link from "next/link";
import GitHubStats from "./GitHubStats";
import StatusPill from "./StatusPill";

interface ProjectCardProps {
  title: string;
  description: string;
  status:
    | "SHIPPED · CLIENT WORK"
    | "HARDWARE · PUBLISHED"
    | "SYSTEMS · SECURITY"
    | "STORAGE · FORENSICS";
  href: string;
  repo?: string;
  fallbackStars?: number;
  fallbackPush?: string;
}

export default function ProjectCard({
  title,
  description,
  status,
  href,
  repo,
  fallbackStars = 0,
  fallbackPush = "",
}: ProjectCardProps) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group block rounded-[--r-md] border border-[--line] bg-[--surface] p-6 transition-all duration-[--dur-fast] hover:border-[--accent] hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
    >
      <h3 className="font-display text-lg mb-1 text-[--text] group-hover:text-[--accent] transition-colors">
        {title}
      </h3>
      <p className="text-[--muted] text-sm mb-4 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center justify-between">
        <StatusPill status={status} />
        {repo && (
          <GitHubStats
            repo={repo}
            fallback={{ stars: fallbackStars, lastPush: fallbackPush }}
          />
        )}
        {!repo && (
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted]">
            Live
          </span>
        )}
      </div>
    </Link>
  );
}
