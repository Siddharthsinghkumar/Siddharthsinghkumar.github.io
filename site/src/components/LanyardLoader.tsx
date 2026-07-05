"use client";

import dynamic from "next/dynamic";

const Lanyard = dynamic(() => import("./Lanyard"), {
  ssr: false,
});

export default function LanyardLoader(props: any) {
  return <Lanyard {...props} />;
}
