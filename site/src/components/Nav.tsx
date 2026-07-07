"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";
import DecryptedText from "./DecryptedText";

const links = [
  { href: "/prospect", label: "Prospect" },
  { href: "/travel-planner", label: "Travel Planner" },
  { href: "/projects", label: "Projects" },
  { href: "/knowme", label: "KnowMe" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Nav decrypt: fires once per page navigation. Home waits for engineReady
  // (+500ms); subpages fire on mount. DecryptedText only mounts when ready,
  // so its IntersectionObserver fires immediately = one decrypt per navigation.
  const [canDecrypt, setCanDecrypt] = useState(false);
  const [decryptDone, setDecryptDone] = useState(false);

  // Reset on pathname change
  useEffect(() => {
    setCanDecrypt(false);
    setDecryptDone(false);

    if (isHome) {
      import("./engine/engine-ready").then(({ engineReady }) => {
        engineReady.then(() => {
          setTimeout(() => setCanDecrypt(true), 500);
        });
      });
    } else {
      setCanDecrypt(true);
    }
  }, [isHome, pathname]);

  // Mark decrypt complete after the longest decrypt would have finished.
  // "Travel Planner" = 14 chars × 40ms sequential ≈ 560ms + margin.
  useEffect(() => {
    if (!canDecrypt) return;
    const timer = setTimeout(() => setDecryptDone(true), 1500);
    return () => clearTimeout(timer);
  }, [canDecrypt]);

  const linkBaseClass =
    "font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em] transition-colors duration-[--dur-fast]";

  return (
    <>
      {/* Layer 5.1: Reserved for future nav background effects */}
      <div className="fixed top-0 left-0 right-0 z-[40] h-16 pointer-events-none" />

      <nav className="fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-[300ms] ease-[--ease] border-b border-[--line]">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 relative">
          {/* Wordmark — DecryptedText mounts only when ready */}
          <a
            href="/"
            className="font-mono text-[10px] xs:text-[11px] md:text-[13px] uppercase tracking-[0.08em] text-[--text] whitespace-nowrap no-underline group"
          >
            {canDecrypt ? (
              <span className="hidden xs:inline">
                <DecryptedText
                  text="Siddharth Singh"
                  animateOn="view"
                  speed={30}
                  maxIterations={8}
                  sequential={true}
                  revealDirection="center"
                  className="text-[--text]"
                  encryptedClassName="text-[--muted]"
                  parentClassName="font-mono uppercase tracking-[0.08em]"
                />
              </span>
            ) : null}
            {canDecrypt ? (
              <span className="xs:hidden">
                <DecryptedText
                  text="SS"
                  animateOn="view"
                  speed={30}
                  maxIterations={4}
                  sequential={false}
                  className="text-[--text]"
                  encryptedClassName="text-[--muted]"
                  parentClassName="font-mono uppercase tracking-[0.08em]"
                />
              </span>
            ) : null}
            {!canDecrypt ? (
              <span className="font-mono uppercase tracking-[0.08em] text-[--text]">
                Siddharth Singh
              </span>
            ) : null}
          </a>

          <div className="flex items-center gap-3 xs:gap-5 md:gap-8">
            {links.map(({ href, label }) => {
              const active = pathname === href;
              const colorClass = active
                ? "text-[--accent]"
                : "text-[--muted]";
              const hoverClass = decryptDone
                ? "group-hover:text-[--accent]"
                : "";
              return (
                <Link key={href} href={href} className="group">
                  {canDecrypt ? (
                    <DecryptedText
                      text={label}
                      animateOn="view"
                      speed={40}
                      maxIterations={8}
                      sequential={true}
                      revealDirection="center"
                      className={`${linkBaseClass} ${colorClass} ${hoverClass}`}
                      encryptedClassName={`font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em] text-[--line]`}
                      parentClassName="font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em]"
                    />
                  ) : (
                    <span className={`${linkBaseClass} ${colorClass}`}>
                      {label}
                    </span>
                  )}
                </Link>
              );
            })}

            <Button
              variant="primary"
              href="/resume-siddharth-singh.pdf"
              linkPulse={false}
              className="text-[10px] xs:text-[11px] px-2 xs:px-3 py-1.5 whitespace-nowrap"
            >
              Resume ↓
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
}
