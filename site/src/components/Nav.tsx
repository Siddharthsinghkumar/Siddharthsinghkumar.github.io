"use client";

import { useEffect, useState, useRef } from "react";
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

  const [canDecrypt, setCanDecrypt] = useState(false);
  const [decryptDone, setDecryptDone] = useState(false);
  const [waveFlash, setWaveFlash] = useState(false); // orange text flash during wave
  const navRef = useRef<HTMLElement>(null);

  // Reset on pathname change
  useEffect(() => {
    setCanDecrypt(false);
    setDecryptDone(false);
    setWaveFlash(false);

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

  // Mark decrypt complete → trigger initial orange flash
  useEffect(() => {
    if (!canDecrypt) return;
    const timer = setTimeout(() => {
      setDecryptDone(true);
      // Flash nav links orange
      setWaveFlash(true);
      setTimeout(() => setWaveFlash(false), 300);
    }, 1500);
    return () => clearTimeout(timer);
  }, [canDecrypt]);

  const linkBaseClass =
    "font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em] transition-colors duration-[--dur-fast]";

  return (
    <nav
      ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-[300ms] ease-[--ease] border-b border-[--line]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 relative">
          {/* Wordmark */}
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
              const flashClass = waveFlash ? "text-[--accent] transition-colors duration-75" : "";
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
                      className={`${linkBaseClass} ${colorClass} ${hoverClass} ${flashClass}`}
                      encryptedClassName={`font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em] text-[--line]`}
                      parentClassName="font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em]"
                    />
                  ) : (
                    <span className={`${linkBaseClass} ${colorClass} ${flashClass}`}>
                      {label}
                    </span>
                  )}
                </Link>
              );
            })}

            <Button
              variant="primary"
              href="/resume-siddharth-singh.pdf"
              className="text-[10px] xs:text-[11px] px-2 xs:px-3 py-1.5 whitespace-nowrap expanded-hit-area"
            >
              Resume ↓
            </Button>
          </div>
        </div>
      </nav>
  );
}
