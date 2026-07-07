"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";
import DecryptedText from "./DecryptedText";
import NavRipple, { RippleEvent } from "./NavRipple";

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
  const [ripples, setRipples] = useState<RippleEvent[]>([]);
  const ripplesRef = useRef<RippleEvent[]>([]);
  const navRef = useRef<HTMLElement>(null);

  const emitRipple = useCallback((x: number) => {
    const now = performance.now();
    const event: RippleEvent = { x, startTime: now + 50 };
    ripplesRef.current = [...ripplesRef.current, event];
    setRipples([...ripplesRef.current]);
  }, []);

  // Reset on pathname change
  useEffect(() => {
    setCanDecrypt(false);
    setDecryptDone(false);
    setWaveFlash(false);
    ripplesRef.current = [];
    setRipples([]);

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

  // Mark decrypt complete → trigger initial wave + orange flash
  useEffect(() => {
    if (!canDecrypt) return;
    const timer = setTimeout(() => {
      setDecryptDone(true);
      // Initial wave sweeps from the center
      emitRipple(0.5);
      // Flash nav links orange
      setWaveFlash(true);
      setTimeout(() => setWaveFlash(false), 300);
    }, 1500);
    return () => clearTimeout(timer);
  }, [canDecrypt, emitRipple]);

  // Intercept clicks on nav links to add press ripple
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !decryptDone) return;

    const handler = (e: Event) => {
      const me = e as MouseEvent;
      const rect = nav.getBoundingClientRect();
      const x = (me.clientX - rect.left) / rect.width;
      emitRipple(x);
    };

    const aTags = nav.querySelectorAll("a:not([href*='.pdf'])");
    aTags.forEach((a) => a.addEventListener("click", handler));
    return () => aTags.forEach((a) => a.removeEventListener("click", handler));
  }, [decryptDone, emitRipple]);

  const linkBaseClass =
    "font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em] transition-colors duration-[--dur-fast]";

  return (
    <>
      {/* Layer 5.1: Nav background effects slot */}
      <div className="fixed top-0 left-0 right-0 z-[40] h-16 pointer-events-none overflow-hidden">
        <NavRipple ripples={ripples} />
      </div>

      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-[300ms] ease-[--ease] border-b border-[--line]"
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
