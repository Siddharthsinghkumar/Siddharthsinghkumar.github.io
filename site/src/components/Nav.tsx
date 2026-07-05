"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";
import { FlutedGlass } from "@paper-design/shaders-react";

const links = [
  { href: "/prospect", label: "Prospect" },
  { href: "/travel-planner", label: "Travel Planner" },
  { href: "/projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Feature-query check: only enable glass if backdrop-filter is supported
    const supportsBackdrop = CSS.supports("backdrop-filter", "blur(1px)");
    if (!supportsBackdrop) return;

    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll(); // check initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-[300ms] ease-[--ease] border-b border-[--line] ${
        scrolled ? "" : "bg-[--bg]/92"
      }`}
    >
      {scrolled && (
        <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
          <FlutedGlass
            colorBack="rgba(0,0,0,0.92)"
            colorShadow="rgba(255,89,0,0.31)"
            colorHighlight="rgb(232, 232, 232)"
            size={0.62}
            shadows={0.25}
            highlights={0.1}
            shape="lines"
            angle={0}
            distortionShape="prism"
            distortion={0.5}
            blur={0}
            edges={0.25}
          />
        </div>
      )}
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 relative z-10">
        <Link
          href="/about"
          className="font-mono text-[10px] xs:text-[11px] md:text-[13px] uppercase tracking-[0.08em] text-[--text] hover:text-[--accent] transition-colors duration-[--dur-fast] whitespace-nowrap"
        >
          <span className="hidden xs:inline">Siddharth Singh</span>
          <span className="xs:hidden">SS</span>
        </Link>

        <div className="flex items-center gap-3 xs:gap-5 md:gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-mono text-[10px] xs:text-[11px] uppercase tracking-[0.08em] transition-colors duration-[--dur-fast] hover:text-[--accent] ${
                pathname === href ? "text-[--accent]" : "text-[--muted]"
              }`}
            >
              {label}
            </Link>
          ))}

          <Button
            variant="primary"
            href="/resume-siddharth-singh.pdf"
            className="text-[10px] xs:text-[11px] px-2 xs:px-3 py-1.5 whitespace-nowrap"
          >
            Resume ↓
          </Button>
        </div>
      </div>
    </nav>
  );
}
