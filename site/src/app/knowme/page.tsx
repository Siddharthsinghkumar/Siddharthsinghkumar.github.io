import type { Metadata } from "next";
import KnowMeBackground from "@/components/KnowMeBackground";
import KnowMeClient from "./KnowMeClient";

export const metadata: Metadata = {
  title: "Know Me | Siddharth Singh",
  description: "AI Backend Engineer — agentic pipelines, LLM orchestration, local inference. Get in touch.",
  openGraph: {
    title: "Know Me | Siddharth Singh",
    description: "AI Backend Engineer — agentic pipelines, LLM orchestration, local inference.",
    images: [{ url: "/og/knowme.png", width: 1200, height: 630 }],
  },
};

export default function KnowMePage() {
  return (
    <div id="knowme-root" className="pt-24 pb-24 min-h-[100svh] relative overflow-hidden">
      <KnowMeBackground />
      <KnowMeClient />
    </div>
  );
}
