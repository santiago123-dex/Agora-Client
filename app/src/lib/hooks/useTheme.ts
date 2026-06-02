"use client";

import { useEffect } from "react";

function applyTheme(theme: string) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function useTheme(theme: string | undefined) {
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      applyTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (!theme) return;
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
}
