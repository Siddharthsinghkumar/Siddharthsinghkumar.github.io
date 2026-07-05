import Button from "./Button";

const BUILD_DATE = new Date().toISOString().slice(0, 10);

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-[--line] px-4 py-16 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="font-display text-2xl md:text-3xl text-[--text] mb-4">
          The next system could be yours.
        </h2>
        <p className="text-[--muted] max-w-prose mb-8">
          I&rsquo;m open to AI backend roles &mdash; India or remote, full-time
          or contract. Email gets answered fastest.
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          <Button href="mailto:siddharthsingh8418@gmail.com">
            siddharthsingh8418@gmail.com
          </Button>
          <Button variant="ghost" href="/resume-siddharth-singh.pdf">
            Resume ↓
          </Button>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[--muted]">
          <a
            href="https://github.com/Siddharthsinghkumar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/siddharth-singh-735340296"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] uppercase tracking-[0.08em] hover:text-[--accent] transition-colors"
          >
            LinkedIn
          </a>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[--line] mt-12">
          BUILT BY HAND · DEPLOYED VIA GITHUB ACTIONS · LAST BUILD {BUILD_DATE}
        </p>
      </div>
    </footer>
  );
}
