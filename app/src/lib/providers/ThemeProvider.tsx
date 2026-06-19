"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useServerInsertedHTML } from "next/navigation";

type Theme = "light" | "dark";

const THEME_KEY = "theme:v1";

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {}
  return null;
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    document.querySelectorAll("iframe").forEach((f) => {
      f.contentWindow?.postMessage({ type: "agora-theme", theme }, "*");
    });
  } catch {}
}

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useServerInsertedHTML(() => (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function(){
            try {
              var t=localStorage.getItem("theme:v1");
              if (t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme:dark)").matches))
                document.documentElement.classList.add("dark");
            }catch(e){}
          })();
        `,
      }}
    />
  ));

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = getStoredTheme();
      if (stored) return stored;
    }
    return "light";
  });

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (!getStoredTheme()) {
        const sys = mq.matches ? "dark" : "light";
        setThemeState(sys);
        applyTheme(sys);
      }
    };
    mq.addEventListener("change", handler);

    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "agora-theme" && e.data?.theme) {
        const t = e.data.theme as Theme;
        setThemeState(t);
        applyTheme(t);
        try { localStorage.setItem(THEME_KEY, t); } catch {}
      }
    };
    window.addEventListener("message", onMessage);

    return () => {
      mq.removeEventListener("change", handler);
      window.removeEventListener("message", onMessage);
    };
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    try { localStorage.setItem(THEME_KEY, newTheme); } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
