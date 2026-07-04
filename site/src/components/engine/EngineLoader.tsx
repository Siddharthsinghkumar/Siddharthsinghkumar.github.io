"use client";

import dynamic from "next/dynamic";

const EngineCanvas = dynamic(() => import("./EngineCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function EngineLoader() {
  return <EngineCanvas />;
}
