"use client";

import { useCallback, useRef, useState } from "react";
import { Layers, BarChart3 } from "lucide-react";
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
            className="relative w-full max-w-2xl rounded-3xl border border-[#e2dcd3]/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(167,139,110,0.12)] backdrop-blur transition-transform duration-200 ease-out"
          >
            <div className="mb-4 flex items-center gap-2 px-1">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="ml-auto text-xs font-medium text-slate-400">Ágora · Dashboard</span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              {[
                { value: "4", label: "Espacios", color: "#275D79" },
                { value: "12", label: "Tareas activas", color: "#3a8cab" },
                { value: "83%", label: "Rendimiento", color: "#10b981" },
                { value: "156", label: "Estudiantes", color: "#f59e0b" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl px-4 py-3 text-white shadow-sm"
                  style={{ backgroundColor: s.color }}
                >
                  <p className="text-xs font-medium text-white/70">{s.label}</p>
                  <p className="mt-0.5 text-xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-10 items-end bg-[#EAB308] px-3 pb-2">
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">creado</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAB308]/10 text-[#EAB308]">
                    <Layers size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-950">Matemáticas Avanzadas</p>
                    <p className="text-xs text-slate-500">Cálculo y álgebra lineal · 32 estudiantes</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">Activo</span>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-10 items-end bg-[#2563EB] px-3 pb-2">
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">creado</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                    <BarChart3 size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-950">Laboratorio de Física</p>
                    <p className="text-xs text-slate-500">Prácticas de laboratorio · 22 estudiantes</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">Activo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
