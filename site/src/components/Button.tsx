import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type BaseProps = {
  variant?: "primary" | "ghost";
  children: ReactNode;
  className?: string;
  linkPulse?: boolean;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const { variant = "primary", children, className = "", linkPulse = true, ...rest } = props;

  const base =
    "inline-flex items-center justify-center font-mono text-[13px] uppercase tracking-[0.08em] rounded-[--r-sm] px-5 py-2.5 transition-colors duration-[--dur-fast] cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--accent]";

  const variantStyles =
    variant === "primary"
      ? "bg-[--accent] text-[--bg] hover:bg-[--accent-dim] active:bg-[--accent-dim]"
      : "bg-transparent border border-[--line] text-[--text] hover:border-[--accent] hover:text-[--accent] active:border-[--accent-dim] active:text-[--accent-dim]";

  const pulseClasses = linkPulse ? " link-pulse-auto link-pulse-hover" : "";
  const classes = `${base} ${variantStyles}${pulseClasses} ${className}`;

  if (props.href) {
    const { href, ...linkProps } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    // next/link only for internal page routes — files (.pdf) and external/mailto
    // URLs must be plain <a> or the router prefetches them as routes (404s).
    const isPageRoute = href.startsWith("/") && !/\.[a-z0-9]+$/i.test(href);
    if (!isPageRoute) {
      return (
        <a href={href} className={classes} {...linkProps}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const { ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
