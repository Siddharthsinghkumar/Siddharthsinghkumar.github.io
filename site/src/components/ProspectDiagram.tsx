export default function ProspectDiagram() {
  return (
    <svg
      viewBox="0 0 800 160"
      className="w-full h-auto"
      role="img"
      aria-label="Prospect pipeline: SCAN → EXTRACT → EMBED → MATCH → GENERATE → DELIVER"
    >
      <defs>
        <marker
          id="arrow-orange"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>

      {[
        { x: 20, w: 100, label: "SCAN", sub: "OCR engine" },
        { x: 140, w: 100, label: "EXTRACT", sub: "LLM pipeline" },
        { x: 260, w: 100, label: "EMBED", sub: "FAISS vectors" },
        { x: 380, w: 100, label: "MATCH", sub: "Semantic search" },
        { x: 500, w: 100, label: "GENERATE", sub: "Resume tailoring" },
        { x: 620, w: 100, label: "DELIVER", sub: "Telegram alerts" },
      ].map(({ x, w, label, sub }) => (
        <g key={label}>
          <rect
            x={x}
            y={30}
            width={w}
            height={56}
            rx="6"
            fill="var(--surface)"
            stroke="var(--line)"
            strokeWidth="1"
          />
          <text
            x={x + w / 2}
            y={52}
            textAnchor="middle"
            fill="var(--accent)"
            fontFamily="var(--font-ibm-plex-mono), monospace"
            fontSize="11"
            fontWeight="600"
          >
            {label}
          </text>
          <text
            x={x + w / 2}
            y={72}
            textAnchor="middle"
            fill="var(--muted)"
            fontFamily="var(--font-inter), sans-serif"
            fontSize="10"
          >
            {sub}
          </text>
          {/* Arrow to next */}
          {label !== "DELIVER" && (
            <line
              x1={x + w + 4}
              y1={58}
              x2={x + w + 16}
              y2={58}
              stroke="var(--accent)"
              strokeWidth="1.5"
              markerEnd="url(#arrow-orange)"
            />
          )}
        </g>
      ))}

      {/* Bottom labels — components */}
      <text
        x="70"
        y="120"
        fill="var(--muted)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="10"
        textAnchor="middle"
      >
        smart-job-scanner-v2
      </text>
      <text
        x="190"
        y="120"
        fill="var(--muted)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="10"
        textAnchor="middle"
      >
        merlin-cli/bridge
      </text>
      <text
        x="310"
        y="120"
        fill="var(--muted)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="10"
        textAnchor="middle"
      >
        persona-context-engine
      </text>
      <text
        x="430"
        y="120"
        fill="var(--muted)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="10"
        textAnchor="middle"
      >
        job-discovery-engine
      </text>
      <text
        x="550"
        y="120"
        fill="var(--muted)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="10"
        textAnchor="middle"
      >
        merlin-cli/bridge
      </text>
      <text
        x="670"
        y="120"
        fill="var(--muted)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="10"
        textAnchor="middle"
      >
        jobboard-api
      </text>
    </svg>
  );
}
