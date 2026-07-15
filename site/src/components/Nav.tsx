"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";
import DecryptedText from "./DecryptedText";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const links = [
  { href: "/prospect", label: "Prospect" },
  { href: "/travel-planner", label: "Travel Planner" },
  { href: "/projects", label: "Projects" },
  { href: "/knowme", label: "KnowMe" },
];

/** Stateful nav content remounts on pathname change — serves as the reset. */
function NavContent({ pathname, isHome }: { pathname: string; isHome: boolean }) {
  const [canDecrypt, setCanDecrypt] = useState(() => !isHome);
  const [decryptDone, setDecryptDone] = useState(false);
  const [waveFlash, setWaveFlash] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Trigger decrypt sequence on mount for home page (non-home starts decrypted)
  useEffect(() => {
    if (!isHome) return;
    import("./engine/engine-ready").then(({ engineReady }) => {
      engineReady.then(() => {
        setTimeout(() => setCanDecrypt(true), 500);
      });
    });
  }, [isHome]);

  // Mark decrypt complete → trigger initial orange flash
  useEffect(() => {
    if (!canDecrypt) return;
    const timer = setTimeout(() => {
      setDecryptDone(true);
      setWaveFlash(true);
      setTimeout(() => setWaveFlash(false), 300);
    }, 1500);
    return () => clearTimeout(timer);
  }, [canDecrypt]);

  // Escape key closes mobile menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Body scroll lock while menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkBaseClass =
    "font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em] transition-colors duration-[--dur-fast]";

  return (
    <>
      {/* Wordmark */}
      <Link
        href="/"
        className="nav-link font-mono text-[10px] xs:text-[11px] md:text-[13px] uppercase tracking-[0.08em] text-[--text] whitespace-nowrap no-underline group expanded-hit-area"
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
      </Link>

      {/* Desktop nav links — hidden on mobile, hamburger is the primary UX */}
      <div className="hidden md:flex items-center gap-3 xs:gap-5 md:gap-8">
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
            <Link key={href} href={href} className="nav-link group">
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
          href="/resume/resume-siddharth-singh.pdf"
          className="text-[10px] xs:text-[11px] px-2 xs:px-3 py-1.5 whitespace-nowrap expanded-hit-area"
        >
          Resume ↓
        </Button>
      </div>

      {/* Mobile hamburger button — visible below md */}
      <button
        ref={menuBtnRef}
        className="md:hidden flex items-center justify-center w-11 h-11 text-[--text] hover:text-[--accent] active:scale-95 transition-colors duration-[--dur-fast] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--accent]"
        onClick={() => setMenuOpen((v) => !v)}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close" : "Menu"}
      >
        <div className="w-5 h-4 relative pointer-events-none">
          <span
            className={`absolute inset-x-0 top-0 h-[2px] bg-current rounded-full transition-all duration-[--dur-med] ${
              menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : ""
            }`}
            style={prefersReduced ? { transition: "none" } : undefined}
          />
          <span
            className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-current rounded-full transition-all duration-[--dur-med] ${
              menuOpen ? "opacity-0" : ""
            }`}
            style={prefersReduced ? { transition: "none" } : undefined}
          />
          <span
            className={`absolute inset-x-0 bottom-0 h-[2px] bg-current rounded-full transition-all duration-[--dur-med] ${
              menuOpen ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
            }`}
            style={prefersReduced ? { transition: "none" } : undefined}
          />
        </div>
      </button>

      {/* Mobile menu overlay + panel */}
      {menuOpen && (
        <>
          {/* Backdrop — closes menu on tap/click */}
          <div
            className="fixed inset-0 top-16 z-40 md:hidden bg-[--bg]/80"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Menu panel */}
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed top-16 left-0 right-0 z-50 md:hidden bg-[--surface] border-b border-[--line] px-4 py-4 shadow-lg"
          >
            <nav className="flex flex-col">
              {links.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`font-mono text-[14px] uppercase tracking-[0.08em] py-4 border-b border-[--line]/50 transition-colors duration-[--dur-fast] ${
                      active
                        ? "text-[--accent]"
                        : "text-[--muted] hover:text-[--accent]"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                );
              })}
              <div className="pt-3">
                <Button
                  variant="primary"
                  href="/resume/resume-siddharth-singh.pdf"
                  className="w-full text-[14px]"
                >
                  Resume ↓
                </Button>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navRef = useRef<HTMLElement>(null);

  return (
    <nav
      ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-[300ms] ease-[--ease] border-b border-[--line]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 relative">
          <NavContent key={pathname} pathname={pathname} isHome={isHome} />
        </div>
      </nav>
  );
}
