import Image from "next/image";
import Link from "next/link";
import logo from "@/app/src/features/landing/assets/logo.png";

export default function   NavbarLanding() {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2 text-slate-950 sm:gap-3">
          <div className="flex  items-center justify-center rounded-xl">
            <Image
              src={logo}
              alt="Logo de Agora"
              className="h-12 w-14 object-contain sm:h-16 sm:w-20"
            />
          </div>
          <span className="text-xl font-semibold tracking-tight sm:text-2xl">Agora</span>
        </Link>

        <nav className="hidden items-center gap-10 text-sm text-slate-500 md:flex">
          <Link
            href="#funciones"
            className="transition-colors hover:text-slate-950"
          >
            Funciones
          </Link>
          <Link
            href="#guia"
            className="transition-colors hover:text-slate-950"
          >
            Guia
          </Link>
          <Link
            href="#precios"
            className="transition-colors hover:text-slate-950"
          >
            Precios
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="inline-flex h-10 min-w-[130px] items-center justify-center rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-slate-50 sm:px-5 sm:text-sm"
          >
            Iniciar Sesion
          </Link>
          <Link
            href="/register"
            className="inline-flex h-10 min-w-[130px] items-center justify-center rounded-xl bg-[#2f6787] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:px-5 sm:py-2.5 sm:text-sm"
          >
            Comenzar Gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
