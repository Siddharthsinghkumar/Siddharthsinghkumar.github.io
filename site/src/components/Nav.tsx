"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";

const links = [
  { href: "/prospect", label: "Prospect" },
  { href: "/travel-planner", label: "Travel Planner" },
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
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-[300ms] ease-[--ease] ${
        scrolled
          ? "bg-[--bg]/55 backdrop-blur-[14px] backdrop-saturate-[140%] border-b border-[--line]"
          : "bg-[--bg]/92 backdrop-blur-none border-b border-[--line]"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4">
        <Link
          href="/"
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
