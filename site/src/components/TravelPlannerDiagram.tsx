export default function TravelPlannerDiagram() {
  return (
    <svg
      viewBox="0 0 720 200"
      className="w-full h-auto"
      role="img"
      aria-label="Travel Planner architecture: Router → Circuit Breaker → Ollama fallback → SSE"
    >
      <defs>
        <marker
          id="arrow-accent-2"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
        <marker
          id="arrow-muted"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
        </marker>
      </defs>

      {/* Router */}
      <rect
        x="20"
        y="50"
        width="140"
        height="60"
        rx="6"
        fill="var(--surface)"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <text
        x="90"
        y="78"
        textAnchor="middle"
        fill="var(--text)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="12"
        fontWeight="600"
      >
        Model Router
      </text>
      <text
        x="90"
        y="96"
        textAnchor="middle"
        fill="var(--muted)"
        fontFamily="var(--font-inter), sans-serif"
        fontSize="10"
      >
        scores by cost/health
      </text>

      {/* Arrow to circuit breaker */}
      <line
        x1="160"
        y1="80"
        x2="200"
        y2="80"
        stroke="var(--accent)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-accent-2)"
      />

      {/* Primary path — cloud APIs */}
      <rect
        x="210"
        y="30"
        width="140"
        height="50"
        rx="6"
        fill="var(--surface)"
        stroke="var(--ok)"
        strokeWidth="1"
        strokeDasharray="none"
      />
      <text
        x="280"
        y="58"
        textAnchor="middle"
        fill="var(--ok)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="11"
        fontWeight="600"
      >
        Cloud LLM APIs
      </text>

      {/* Circuit breaker box */}
      <rect
        x="210"
        y="100"
        width="140"
        height="50"
        rx="6"
        fill="var(--surface)"
        stroke="var(--warn)"
        strokeWidth="1"
      />
      <text
        x="280"
        y="122"
        textAnchor="middle"
        fill="var(--warn)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="11"
        fontWeight="600"
      >
        Circuit Breaker
      </text>
      <text
        x="280"
        y="138"
        textAnchor="middle"
        fill="var(--muted)"
        fontFamily="var(--font-inter), sans-serif"
        fontSize="10"
      >
        detects degradation
      </text>

      {/* Dashed fallback arrow */}
      <line
        x1="280"
        y1="100"
        x2="280"
        y2="80"
        stroke="var(--warn)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <line
        x1="280"
        y1="100"
        x2="430"
        y2="125"
        stroke="var(--warn)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        markerEnd="url(#arrow-muted)"
      />

      {/* Fallback path — local Ollama */}
      <rect
        x="370"
        y="100"
        width="140"
        height="50"
        rx="6"
        fill="var(--surface)"
        stroke="var(--accent)"
        strokeWidth="1"
      />
      <text
        x="440"
        y="122"
        textAnchor="middle"
        fill="var(--accent)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="11"
        fontWeight="600"
      >
        Local Ollama
      </text>
      <text
        x="440"
        y="138"
        textAnchor="middle"
        fill="var(--muted)"
        fontFamily="var(--font-inter), sans-serif"
        fontSize="10"
      >
        fallback inference
      </text>

      {/* Continue from cloud */}
      <line
        x1="350"
        y1="55"
        x2="400"
        y2="55"
        stroke="var(--ok)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-accent-2)"
      />

      {/* Merge → SSE */}
      <rect
        x="410"
        y="30"
        width="140"
        height="50"
        rx="6"
        fill="var(--surface)"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <text
        x="480"
        y="52"
        textAnchor="middle"
        fill="var(--text)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="11"
        fontWeight="600"
      >
        SSE Stream
      </text>
      <text
        x="480"
        y="68"
        textAnchor="middle"
        fill="var(--muted)"
        fontFamily="var(--font-inter), sans-serif"
        fontSize="10"
      >
        never drops
      </text>

      {/* Arrow to output */}
      <line
        x1="550"
        y1="55"
        x2="590"
        y2="55"
        stroke="var(--accent)"
        strokeWidth="1.5"
        markerEnd="url(#arrow-accent-2)"
      />

      {/* Output */}
      <rect
        x="600"
        y="40"
        width="100"
        height="40"
        rx="6"
        fill="var(--surface-2)"
        stroke="var(--accent)"
        strokeWidth="1"
      />
      <text
        x="650"
        y="65"
        textAnchor="middle"
        fill="var(--accent)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="11"
        fontWeight="600"
      >
        Client
      </text>

      {/* Infrastructure label at bottom */}
      <text
        x="360"
        y="185"
        textAnchor="middle"
        fill="var(--line)"
        fontFamily="var(--font-ibm-plex-mono), monospace"
        fontSize="10"
      >
        k3s multi-node cluster · Prometheus/Grafana · FastAPI
      </text>
    </svg>
  );
}
