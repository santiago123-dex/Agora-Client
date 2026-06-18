"use client";

import { Sun, Moon } from "lucide-react";
import { useThemeContext } from "@/app/src/lib/providers/ThemeProvider";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useThemeContext();

    return (
        <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
            aria-label="Cambiar tema"
        >
            <Sun size={18} className="hidden dark:block" />
            <Moon size={18} className="dark:hidden" />
        </button>
    );
}
