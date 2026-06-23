import Image from "next/image";
import Link from "next/link";

import logo from "@/app/src/features/landing/assets/logo.png";

const footer = (
  <footer className="border-t border-slate-200 bg-[#edf5f8]">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 text-slate-600 lg:flex-row lg:items-center lg:justify-between lg:px-10">
      <Link href="/" className="flex items-center gap-3 text-slate-950">
        <Image
          src={logo}
          alt="Logo de Agora"
          className="logo-light h-14 w-20 object-contain"
        />
        <span className="text-2xl font-semibold tracking-tight">Agora</span>
      </Link>

      <nav className="flex flex-wrap items-center justify-center gap-8 text-base">
        <Link href="/terminos" className="transition-colors hover:text-slate-950">
          Terminos
        </Link>
        <Link href="/privacidad" className="transition-colors hover:text-slate-950">
          Privacidad
        </Link>
        <Link href="/soporte" className="transition-colors hover:text-slate-950">
          Soporte
        </Link>
      </nav>

      <p className="text-sm text-slate-500 lg:text-right">
        2025 Agora. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

export default function FooterSection() {
  return footer;
}
