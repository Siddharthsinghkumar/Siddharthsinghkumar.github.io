"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";
import DecryptedText from "./DecryptedText";
import { FlutedGlass } from "@paper-design/shaders-react";

const links = [
  { href: "/prospect", label: "Prospect" },
  { href: "/travel-planner", label: "Travel Planner" },
  { href: "/projects", label: "Projects" },
  { href: "/knowme", label: "KnowMe" },
];

export default function Nav() {
  const pathname = usePathname();
  // TEMP: Force scrolled to true always per Sid's request
  const [scrolled, setScrolled] = useState(true);
  
  // DecryptedText dual trigger logic
  // On subpages, it's hover-only from the start
  const [hasInitialDecrypted, setHasInitialDecrypted] = useState(pathname !== "/");

  useEffect(() => {
    // Feature-query check: only enable glass if backdrop-filter is supported
    const supportsBackdrop = CSS.supports("backdrop-filter", "blur(1px)");
    if (!supportsBackdrop) return;

    // ORIGINAL: setScrolled(window.scrollY > 40) — commented out, temp always visible per Sid
    /*
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll(); // check initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    */
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      import("./engine/engine-ready").then(({ engineReady }) => {
        engineReady.then(() => {
          // Trigger the initial view animation slightly after engine is ready
          setTimeout(() => {
            setHasInitialDecrypted(true);
          }, 500);
        });
      });
    }
  }, [pathname]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[40] h-16 pointer-events-none">
        {scrolled && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <FlutedGlass
              image="/bg-graphite.png"
              className="w-full h-full"
              colorBack="rgba(0,0,0,0.70)"
              colorShadow="rgba(255,89,0,0.50)"
              colorHighlight="rgb(232, 232, 232)"
              size={0.80}
              shadows={0.25}
              highlights={0.25}
              shape="lines"
              angle={0}
              distortionShape="prism"
              distortion={0.5}
              blur={0}
              edges={0.25}
            />
          </div>
        )}
      </div>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-[300ms] ease-[--ease] border-b border-[--line]"
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 relative">
        {/* T14: plain <a> so clicking from hero page actually reloads (Next <Link> is no-op on same route) */}
        <a
          href="/"
          className="font-mono text-[10px] xs:text-[11px] md:text-[13px] uppercase tracking-[0.08em] text-[--text] hover:text-[--accent] transition-colors duration-[--dur-fast] whitespace-nowrap no-underline group"
        >
          <span className="hidden xs:inline">
            <DecryptedText
              text="Siddharth Singh"
              animateOn={hasInitialDecrypted ? "hover" : "view"}
              speed={30}
              maxIterations={8}
              sequential={true}
              revealDirection="center"
              className="text-[--text]"
              encryptedClassName="text-[--muted]"
              parentClassName="font-mono uppercase tracking-[0.08em]"
            />
          </span>
          <span className="xs:hidden">
            <DecryptedText
              text="SS"
              animateOn={hasInitialDecrypted ? "hover" : "view"}
              speed={30}
              maxIterations={4}
              sequential={false}
              className="text-[--text]"
              encryptedClassName="text-[--muted]"
              parentClassName="font-mono uppercase tracking-[0.08em]"
            />
          </span>
        </a>

        <div className="flex items-center gap-3 xs:gap-5 md:gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="group"
            >
              <DecryptedText
                text={label}
                animateOn={hasInitialDecrypted ? "hover" : "view"}
                speed={40}
                maxIterations={8}
                sequential={true}
                revealDirection="center"
                className={`font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em] transition-colors duration-[--dur-fast] ${
                  pathname === href ? "text-[--accent]" : "text-[--muted]"
                } group-hover:text-[--accent]`}
                encryptedClassName={`font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em] text-[--line]`}
                parentClassName="font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em]"
              />
            </Link>
          ))}

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
