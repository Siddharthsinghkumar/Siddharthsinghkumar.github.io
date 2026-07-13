"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import IntroScreen from "./IntroScreen";
import { isIntroShown, markIntroShown } from "./intro-session";

export default function IntroScreenGate() {
  const pathname = usePathname();
  const shown = useSyncExternalStore(
    () => () => {},
    isIntroShown,
    () => false,
  );
  const show = !shown;
  const waitForEngine = pathname === "/";
  const waitForLanyard = pathname.startsWith("/knowme");

  useEffect(() => {
    if (!shown) {
      markIntroShown();
    }
  }, [shown]);

  if (!show) return null;
  return <IntroScreen waitForEngine={waitForEngine} waitForLanyard={waitForLanyard} />;
}
