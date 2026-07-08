// Token hex constants — single source of truth for hardcoded hex values.
// All values match site/src/app/globals.css CSS custom properties.
// Guards.mjs allowslist this file; rogue-hex violations MUST go through here.

export const TOKEN_HEX = {
  /** --bg: hsl(240 8% 5%) — Graphite background */
  bg: "#0B0B0D",
  /** --accent: hsl(17 100% 55%) — Signal Orange */
  accent: "#FF5C1A",
  /** --text: hsl(43 13% 90%) — Near-white text */
  text: "#E8E8E8",
  /** --muted: hsl(240 4% 56%) — Muted secondary text */
  muted: "#8A8A93",
  /** --surface: hsl(240 5% 8%) — Raised surface */
  surface: "#141416",
  /** Pure white for shader highlights and fallbacks */
  white: "#ffffff",
  /** Pure black for shadows */
  black: "#000000",
  /** Fully transparent (rgba black, alpha 0) */
  transparent: "#00000000",
  /** Paper shader front color (warm-gray tone, not a token) */
  paperFront: "#9fadbc",
} as const;

export type TokenHexKey = keyof typeof TOKEN_HEX;
