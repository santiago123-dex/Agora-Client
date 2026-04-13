"use client";

import Image from "next/image";
import logo from "@/public/images/logo-cropped.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard-icon lucide-layout-dashboard">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    label: "Mis Espacios",
    href: "/dashboard/workspace",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-icon lucide-book-open">
        <path d="M12 7v14" />
        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    ),
  },
  {
    label: "Configuración",
    href: "/dashboard/configuration",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cog-icon lucide-cog">
        <path d="M11 10.27 7 3.34" />
        <path d="m11 13.73-4 6.93" />
        <path d="M12 22v-2" />
        <path d="M12 2v2" />
        <path d="M14 12h8" />
        <path d="m17 20.66-1-1.73" />
        <path d="m17 3.34-1 1.73" />
        <path d="M2 12h2" />
        <path d="m20.66 17-1.73-1" />
        <path d="m20.66 7-1.73 1" />
        <path d="m3.34 17 1.73-1" />
        <path d="m3.34 7 1.73 1" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    ),
  },
];

export default function LayoutDashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  return (

    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      {/* Vista de deskstop*/}
      <aside className="hidden bg-[#275D79] lg:flex lg:min-h-screen lg:w-60 lg:shrink-0 lg:flex-col">

        <Link href="/" className="flex h-16 items-center gap-2 border-b border-[#ededed]/10 px-3">
          <Image src={logo} alt="Logo Agora" className="h-10 w-10 shrink-0 object-contain brightness-1000" />
          <h2 className="text-xl font-bold text-white">Agora</h2>
        </Link>

        <div className="flex flex-col gap-2 px-3 py-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors ${isActive
                  ? "bg-white font-semibold text-[#275D79]"
                  : "text-white/90 hover:bg-white/15 hover:text-white"
                  }`}
              >
                {link.svg}
                {link.label}
              </Link>
            );
          })}
        </div>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 bg-slate-50">
          <nav className="flex h-14 items-center gap-3 border-b border-[#ededed] px-4 sm:h-16 sm:px-6">
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Cerrar menú lateral" : "Abrir menú lateral"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-dashboard-menu"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#dadada] bg-white text-[#275D79] lg:hidden"
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h16" />
                  <path d="M4 6h16" />
                  <path d="M4 18h16" />
                </svg>
              )}
            </button>
            <span className="text-[18px] text-center font-semibold text-[#275D79] sm:hidden">Agora</span>
            <input
              type="text"
              className="hidden w-full max-w-full rounded-md border border-[#dadada] bg-[#ddecf1] px-4 py-1 text-[#275d79] placeholder:text-[#275D79] focus:border-[#dadada] focus:outline-none focus:ring-0 sm:block sm:max-w-sm sm:px-6"
              placeholder="/Configuration"
            />
          </nav>
        </header>
        <main>{children}</main>
      </div>
      {/*Parte mobile*/}
      <div
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="mobile-dashboard-menu"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[82vw] bg-[#275D79] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#ededed]/10 px-3">
         
            <Link href="/" className="flex items-center gap-2">
              <Image src={logo} alt="Logo Agora" className="h-10 w-10 shrink-0 object-contain brightness-1000" />
              <h2 className="text-xl font-bold text-white">Agora</h2>
            </Link>
         
          <button
            type="button"
            aria-label="Cerrar menú lateral"
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/20 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-2 px-3 py-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors ${isActive
                  ? "bg-white font-semibold text-[#275D79]"
                  : "text-white/90 hover:bg-white/15 hover:text-white"
                  }`}
              >
                {link.svg}
                {link.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
