"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "theme:v1";

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        const isDark = stored === "dark";
        setDark(isDark);
        document.documentElement.classList.toggle("dark", isDark);
        setMounted(true);
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    };

    if (!mounted) {
        return <div className="h-9 w-9" />;
    }

    return (
        <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
            aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
        >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
