"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo-cropped.png";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

export default function NavbarLanding() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const navLinks = [
        { href: "#funciones", label: "Funciones" },
        { href: "#guia", label: "Guía" },
        { href: "#demo", label: "Demo" },
        { href: "#precios", label: "Precios" },
        { href: "#testimonios", label: "Testimonios" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 landing-header">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-10">
                <Link href="/" className="flex items-center gap-2.5 text-slate-950 sm:gap-3">
                    <div className="flex items-center justify-center rounded-xl">
                        <Image
                            src={logo}
                            alt="Logo de Agora"
                            className="h-9 w-9 object-contain sm:h-11 sm:w-11"
                        />
                    </div>
                    <span className="text-xl font-semibold tracking-tight sm:text-2xl">Agora</span>
                </Link>

                <nav className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="transition-colors hover:text-slate-950"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />

                    <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/auth/login"
                            className="inline-flex h-10 min-w-[120px] items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-slate-50 sm:px-5 sm:text-sm"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            href="/auth/register"
                            className="inline-flex h-10 min-w-[130px] items-center justify-center rounded-xl bg-[#2f6787] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:px-5 sm:py-2.5 sm:text-sm"
                        >
                            Comenzar Gratis
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 text-slate-500 md:hidden"
                        aria-label="Menú de navegación"
                    >
                        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {isMobileOpen ? (
                <div className="border-t border-slate-200 bg-white px-4 pb-4 pt-2 md:hidden">
                    <nav className="flex flex-col gap-2 text-sm">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileOpen(false)}
                                className="rounded-xl px-3 py-2.5 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
                            <Link
                                href="/auth/login"
                                onClick={() => setIsMobileOpen(false)}
                                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-300 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-50"
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                href="/auth/register"
                                onClick={() => setIsMobileOpen(false)}
                                className="inline-flex h-10 items-center justify-center rounded-xl bg-[#2f6787] text-sm font-semibold text-white shadow-sm"
                            >
                                Comenzar Gratis
                            </Link>
                        </div>
                    </nav>
                </div>
            ) : null}
        </header>
    );
}
