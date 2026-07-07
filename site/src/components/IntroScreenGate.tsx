"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import IntroScreen from "./IntroScreen";
import { isIntroShown, markIntroShown } from "./intro-session";

export default function IntroScreenGate() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [waitForEngine, setWaitForEngine] = useState(true);

  useEffect(() => {
    if (!isIntroShown()) {
      markIntroShown();
      setShow(true);
      setWaitForEngine(pathname === "/");
    }
  }, [pathname]);

  if (!show) return null;
  return <IntroScreen waitForEngine={waitForEngine} />;
}
