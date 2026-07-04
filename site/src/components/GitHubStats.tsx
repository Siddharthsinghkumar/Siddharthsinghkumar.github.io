"use client";

import { useEffect, useState, useRef } from "react";

interface GitHubRepo {
  stargazers_count: number;
  pushed_at: string;
  description: string | null;
}

interface GitHubData {
  stars: number;
  lastPush: string;
}

interface GitHubStarsProps {
  repo: string;
  fallback: GitHubData;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "today";
  if (diffDays === 1) return "1d ago";
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

export default function GitHubStats({ repo, fallback }: GitHubStarsProps) {
  const [data, setData] = useState<GitHubData>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const controller = new AbortController();

    fetch(
      `https://api.github.com/repos/Siddharthsinghkumar/${repo}`,
      { signal: controller.signal },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((json: GitHubRepo) => {
        if (mountedRef.current) {
          setData({
            stars: json.stargazers_count,
            lastPush: timeAgo(json.pushed_at),
          });
          setLoading(false);
        }
      })
      .catch(() => {
        if (mountedRef.current) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      mountedRef.current = false;
      controller.abort();
    };
  }, [repo]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted]">
        <span className="inline-block w-16 h-3 rounded-sm bg-[--surface-2] animate-pulse" />
        <span className="inline-block w-12 h-3 rounded-sm bg-[--surface-2] animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[--muted]">
        <span>★ {fallback.stars}</span>
        <span>{fallback.lastPush}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[--accent]">
      <span>★ {data.stars}</span>
      <span className="text-[--muted]">{data.lastPush}</span>
    </div>
  );
}
