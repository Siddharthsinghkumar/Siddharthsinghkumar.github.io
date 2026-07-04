import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const siteUrl = "https://Siddharthsinghkumar.github.io";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Siddharth Singh — AI Backend Engineer · Agentic Systems, LLM Pipelines",
    template: "%s | Siddharth Singh",
  },
  description:
    "Siddharth Singh is an AI backend engineer in India building agentic LLM systems — RAG pipelines, tool-calling runtimes, and local inference. Creator of Prospect, an autonomous job-prospecting engine.",
  authors: [{ name: "Siddharth Singh" }],
  creator: "Siddharth Singh",
  formatDetection: { email: false, telephone: false, address: false },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Siddharth Singh",
    locale: "en_IN",
    url: siteUrl,
    title: "Siddharth Singh — AI Backend Engineer",
    description:
      "AI backend engineer building agentic LLM systems — RAG pipelines, tool-calling runtimes, and local inference.",
    images: [{ url: "/og/home.svg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} antialiased`}
    >
      <head>
        {/* theme-color for browser chrome */}
        <meta name="theme-color" content="#0B0B0D" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-screen bg-[--bg] text-[--text] font-sans">
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

