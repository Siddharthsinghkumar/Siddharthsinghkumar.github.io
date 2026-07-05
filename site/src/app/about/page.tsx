import type { Metadata } from "next";
import Section from "@/components/Section";
import LanyardLoader from "@/components/LanyardLoader";

export const metadata: Metadata = {
  title: "About | Siddharth Singh",
  description: "AI Backend Engineer — agentic pipelines, LLM orchestration, local inference.",
};

export default function About() {
  // Generated monogram face image via canvas (data URI) for now.
  const frontImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'><rect width='400' height='600' fill='%230B0B0D'/><rect x='0' y='0' width='400' height='100' fill='%23FF5C1A'/><text x='200' y='300' font-family='monospace' font-size='60' font-weight='bold' fill='%23E8E8E8' text-anchor='middle' dominant-baseline='middle'>SS</text><text x='200' y='500' font-family='monospace' font-size='30' fill='%23FF5C1A' text-anchor='middle'>AI BACKEND ENGINEER</text></svg>";
  
  const backImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'><rect width='400' height='600' fill='%230B0B0D'/><rect x='0' y='0' width='400' height='100' fill='%23FF5C1A'/><text x='200' y='300' font-family='monospace' font-size='40' font-weight='bold' fill='%23E8E8E8' text-anchor='middle'>QR CODE HERE</text></svg>";

  return (
    <div className="pt-24 pb-24 min-h-[100svh] relative">
      <div className="absolute inset-0 pointer-events-none z-[-1]" style={{ opacity: 0.8 }}>
        <LanyardLoader frontImage={frontImage} backImage={backImage} />
      </div>
      
      <Section className="relative z-10 flex flex-col justify-center min-h-[80svh] px-4">
        <div className="max-w-[68ch] mx-auto bg-[--bg]/80 backdrop-blur-md p-8 rounded-lg border border-[--line]">
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-none tracking-[-0.02em] text-[--text] mb-6">
            About
          </h1>
          <p className="text-[--muted] text-lg mb-6 leading-relaxed">
            I am an AI Backend Engineer focused on production LLM orchestration, agentic tool-calling runtimes, local inference (Ollama, llama.cpp), and RAG pipelines.
            I also have experience as a Full-Stack Engineer shipping zero-to-one platforms using Next.js and FastAPI.
            My background includes Embedded & Systems Engineering, working with C++, FPGA, Linux, and hardware debugging.
            I build systems that work while you sleep.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-[--muted]">
            <a href="mailto:siddharthsingh8418@gmail.com" className="font-mono text-[13px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors">
              Email
            </a>
            <a href="https://github.com/Siddharthsinghkumar" target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/siddharth-singh-735340296" target="_blank" rel="noopener noreferrer" className="font-mono text-[13px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
