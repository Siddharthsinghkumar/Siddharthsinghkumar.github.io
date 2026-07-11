"use client";

import { useEffect } from "react";

export default function ConsoleFix() {
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === "string") {
        if (args[0].includes("THREE.Clock: This module has been deprecated")) return;
        if (args[0].includes("Uniform location for u_worldWidth not found")) return;
        if (args[0].includes("Uniform location for u_worldHeight not found")) return;
        if (args[0].includes("using deprecated parameters for the initialization function")) return;
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return null;
}
