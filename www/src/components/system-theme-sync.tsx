"use client";

import { useTheme } from "fumadocs-ui/provider/base";
import { useEffect } from "react";

export function SystemThemeSync() {
  const { setTheme } = useTheme();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => setTheme("system");

    preference.addEventListener("change", followSystem);
    return () => preference.removeEventListener("change", followSystem);
  }, [setTheme]);

  return null;
}
