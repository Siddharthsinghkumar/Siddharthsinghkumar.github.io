"use client";

import DecryptedText from "@/components/DecryptedText";

interface ContributionsDisplayProps {
  display: string;
  fallback: boolean;
}

export default function ContributionsDisplay({
  display,
  fallback,
}: ContributionsDisplayProps) {
  if (fallback) {
    return (
      <span>
        See{" "}
        <a
          href="https://github.com/Siddharthsinghkumar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[--accent] hover:underline"
        >
          GitHub →
        </a>
      </span>
    );
  }

  return (
    <DecryptedText
      text={`${display} contributions in the last year`}
      animateOn="view"
      speed={40}
      maxIterations={8}
      sequential={true}
      revealDirection="center"
      className="font-mono text-[--accent]"
      encryptedClassName="font-mono text-[--muted]"
      parentClassName="font-mono"
    />
  );
}
