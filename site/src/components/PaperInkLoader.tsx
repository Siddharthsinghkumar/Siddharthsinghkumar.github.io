"use client";

import dynamic from "next/dynamic";

const PaperInkCanvas = dynamic(() => import("./PaperInkCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function PaperInkLoader() {
  return <PaperInkCanvas />;
}
