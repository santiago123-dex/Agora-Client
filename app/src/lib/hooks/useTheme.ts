"use client";

import { useEffect } from "react";

const THEME_KEY = "theme:v1";

function applyTheme(theme: string) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

function migrateTheme(): string | null {
  try {
    const oldValue = localStorage.getItem("theme");
    if (oldValue === "dark" || oldValue === "light") {
      localStorage.setItem(THEME_KEY, oldValue);
      localStorage.removeItem("theme");
      return oldValue;
    }
  } catch {}

  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

export function useTheme(theme: string | undefined) {
  useEffect(() => {
    const stored = migrateTheme();
    if (stored === "dark" || stored === "light") {
      applyTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (!theme) return;
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // localStorage not available
    }
  }, [theme]);
}
