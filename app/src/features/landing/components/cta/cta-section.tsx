import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-[#275D79] py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-8 max-w-4xl text-center">
          <h2 className="serif mb-3 text-4xl tracking-tight text-white">
            Listo para transformar tu forma de ense&ntilde;ar?
          </h2>
          <p className="text-slate-300">
            Unete a miles de profesores que ya estan usando Agora para
            simplificar su trabajo.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-[#275D79] transition-transform hover:-translate-y-0.5"
          >
            Comenzar Gratis
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Iniciar Sesion
          </Link>
        </div>
      </div>
    </section>
  );
}
