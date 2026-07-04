export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Siddharth Singh",
    jobTitle: "AI Backend Engineer",
    url: "https://Siddharthsinghkumar.github.io",
    sameAs: [
      "https://github.com/Siddharthsinghkumar",
      "https://www.linkedin.com/in/siddharth-singh-735340296",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    image: "https://Siddharthsinghkumar.github.io/og/home.svg",
    description:
      "AI backend engineer building agentic LLM systems — RAG pipelines, tool-calling runtimes, and local inference. Creator of Prospect.",
    knowsAbout: [
      "AI Backend Engineering",
      "LLM Orchestration",
      "RAG Pipelines",
      "Local Inference",
      "Agentic Systems",
      "Python",
      "FastAPI",
      "LangGraph",
      "Next.js",
      "Supabase",
      "Docker",
      "Kubernetes",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
