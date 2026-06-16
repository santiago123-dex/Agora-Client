"use client";

import { useCallback, useRef, useState } from "react";
import { BookOpen, FileText } from "lucide-react";
import ScrollReveal from "../ScrollReveal";
import AnimatedCounter from "../AnimatedCounter";

const stats = [
  { value: "10k+", label: "Profesores activos" },
  { value: "500k+", label: "Tareas calificadas" },
  { value: "98%", label: "Satisfacción" },
];

export default function HeroSection() {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(y * -6);
    setRotateY(x * 6);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  return (
    <section className="relative w-full grid items-center gap-14 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(560px,0.95fr)] lg:px-30 px-6 pt-16 pb-16 md:pt-20 lg:pt-24 mesh-gradient">
      {/* Greek key accent line */}
      <div className="absolute top-0 left-0 right-0 meander-divider" />

      <ScrollReveal>
        <div className="max-w-2xl">
          <div className="mb-8 inline-flex items-center rounded-full border border-[#cfe0ea] bg-white/70 px-4 py-2 text-sm font-medium text-[#275D79] shadow-sm backdrop-blur">
            <span className="mr-2 text-base">✦</span>
            Potenciado con Inteligencia Artificial
          </div>

          <h1 className="serif max-w-xl text-5xl tracking-tight text-slate-950 sm:text-6xl lg:text-7xl lg:leading-[1.05]">
            La plataforma educativa que{" "}
            <span className="bg-linear-to-r from-[#275D79] via-[#3d8db5] to-[#275D79] bg-clip-text text-transparent animate-gradient-x">
              transforma
            </span>{" "}
            tu forma de enseñar
          </h1>

          <p className="mt-8 max-w-xl text-xl leading-9 text-slate-400">
            Crea espacios de trabajo, asigna tareas y califica automáticamente
            con IA. Todo lo que necesitas para gestionar tus clases en un solo
            lugar.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#comenzar"
              className="inline-flex items-center justify-center rounded-xl bg-[#275D79] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#2f6787]/15 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#2f6787]/25"
            >
              Comenzar Ahora
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-medium text-slate-950 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-slate-50"
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
                  <AnimatedCounter value={stat.value} />
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
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            }}
            className="relative w-full max-w-2xl rounded-[28px] border border-[#e2dcd3]/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(167,139,110,0.12)] backdrop-blur transition-transform duration-200 ease-out"
          >
            <div className="space-y-3 rounded-3xl bg-[#f5f0ea] p-4">
              <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#275D79] shadow-sm">
                    <BookOpen size={18} />
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

              <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#275D79] shadow-sm">
                    <FileText size={18} />
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
