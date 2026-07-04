"use client";

import Link from "next/link";
import Button from "@/components/Button";
import DecryptedText from "@/components/DecryptedText";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-[clamp(1.25rem,3vw,2rem)] uppercase tracking-[0.08em] mb-4">
        <DecryptedText
          text="404 — NO SIGNAL"
          animateOn="view"
          speed={50}
          maxIterations={8}
          sequential={true}
          revealDirection="center"
          className="text-[--muted]"
          encryptedClassName="text-[--line]"
          parentClassName="font-mono tracking-[0.08em] uppercase"
        />
      </p>
      <p className="text-[--muted] text-lg mb-8">
        This route doesn&rsquo;t exist. The systems that do:
      </p>

      <div className="flex flex-wrap gap-4 mb-8">
        <Link
          href="/"
          className="font-mono text-[13px] uppercase tracking-[0.08em] text-[--text] hover:text-[--accent] transition-colors"
        >
          Home
        </Link>
        <Link
          href="/prospect"
          className="font-mono text-[13px] uppercase tracking-[0.08em] text-[--text] hover:text-[--accent] transition-colors"
        >
          Prospect
        </Link>
        <Link
          href="/travel-planner"
          className="font-mono text-[13px] uppercase tracking-[0.08em] text-[--text] hover:text-[--accent] transition-colors"
        >
          Travel Planner
        </Link>
      </div>

      <p className="text-[--muted] text-sm mb-4">
        Or skip the browsing:
      </p>
      <Button href="mailto:siddharthsingh8418@gmail.com">
        Email me
      </Button>
    </section>
  );
}
