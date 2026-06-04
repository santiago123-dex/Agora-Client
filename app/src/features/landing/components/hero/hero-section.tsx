import ScrollReveal from "../ScrollReveal";

const stats = [
  { value: "10k+", label: "Profesores activos" },
  { value: "500k+", label: "Tareas calificadas" },
  { value: "98%", label: "Satisfacción" },
];

const particles = Array.from({ length: 5 }, (_, i) => i);

export default function HeroSection() {
  return (
    <section className="relative w-full grid items-center gap-14 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(560px,0.95fr)] lg:px-30 px-6 pt-16 pb-16 md:pt-20 lg:pt-24 mesh-gradient">
      {particles.map((i) => (
        <div key={i} className="particle" />
      ))}

      <ScrollReveal>
        <div className="max-w-2xl">
          <div className="mb-8 inline-flex items-center rounded-full border border-[#cfe0ea] bg-white/70 px-4 py-2 text-sm font-medium text-[#275D79] shadow-sm backdrop-blur">
            <span className="mr-2 text-base">✦</span>
            Potenciado con Inteligencia Artificial
          </div>

          <h1 className="max-w-xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl lg:leading-[1.05]">
            La plataforma educativa que{" "}
            <span className="text-[#275D79]">transforma</span> tu forma de
            enseñar
          </h1>

          <p className="mt-8 max-w-xl text-xl leading-9 text-slate-400">
            Crea espacios de trabajo, asigna tareas y califica automáticamente
            con IA. Todo lo que necesitas para gestionar tus clases en un solo
            lugar.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#comenzar"
              className="inline-flex items-center justify-center rounded-xl bg-[#275D79] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#2f6787]/15 transition-transform hover:-translate-y-0.5"
            >
              Comenzar Ahora
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-medium text-slate-950 shadow-sm transition-colors hover:bg-slate-50"
            >
              Ver Demo
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 border-slate-200 text-slate-950 sm:gap-0">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`pr-8 sm:pr-12 ${index < stats.length - 1 ? "sm:border-r sm:border-slate-200" : ""} ${index > 0 ? "sm:pl-6" : ""}`}
              >
                <p className="text-4xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200}>
        <div className="relative flex min-h-[420px] items-center justify-center">
          <div className="absolute inset-x-10 top-8 h-56 rounded-full bg-[#2f6787]/10 blur-3xl" />
          <div className="relative w-full max-w-2xl rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur">
            <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between rounded-2xl bg-[#eaf3f8] px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#275D79] shadow-sm">
                    <span className="text-lg">📖</span>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-slate-950">
                      Matemáticas Avanzadas
                    </p>
                    <p className="text-sm text-slate-500">32 estudiantes</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Activo
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#eaf3f8] px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#275D79] shadow-sm">
                    <span className="text-lg">📄</span>
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-slate-950">
                      Tarea: Integrales
                    </p>
                    <p className="text-sm text-slate-500">
                      28 entregas pendientes
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Revisar
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
