import type { Metadata } from "next";

const siteUrl = "https://Siddharthsinghkumar.github.io";

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  authors: [{ name: "Siddharth Singh" }],
  creator: "Siddharth Singh",
  publisher: "Siddharth Singh",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#0B0B0D",
  openGraph: {
    type: "website",
    siteName: "Siddharth Singh",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
};
