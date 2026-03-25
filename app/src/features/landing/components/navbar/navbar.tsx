import Image from "next/image";
import Link from "next/link";
import logo from "@/app/src/features/landing/assets/logo.png";

export default function   NavbarLanding() {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-1 lg:px-10">
        <Link href="/" className="flex items-center gap-3 text-slate-950">
          <div className="flex  items-center justify-center rounded-xl">
            <Image
              src={logo}
              alt="Logo de Agora"
              className="h-16 w-20 object-contain"
            />
          </div>
          <span className="text-2xl font-semibold tracking-tight">Agora</span>
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

        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-950 transition-opacity hover:opacity-75"
          >
            Iniciar Sesion
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-[#2f6787] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Comenzar Gratis
          </Link>
        </div>
      </div>
    </header>
  );
}
