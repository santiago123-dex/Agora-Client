"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const steps = [
    { id: "1", title: "Dashboard", description: "Panel principal con estadísticas de todos tus espacios." },
    { id: "2", title: "Espacios de Trabajo", description: "Cursos organizados con estudiantes, tareas y progreso." },
    { id: "3", title: "Tareas y Entregas", description: "Asigná trabajos, recibí entregas y seguí el progreso." },
    { id: "4", title: "Calificación con IA", description: "La IA califica automáticamente y sugiere notas." },
    { id: "5", title: "Más Herramientas", description: "Analíticas, calendario y gradebook para gestionar todo." },
];

export default function DemoSections() {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const goTo = useCallback((i: number) => {
        setCurrent((i + steps.length) % steps.length);
    }, []);

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    useEffect(() => {
        if (isPaused) return;
        timerRef.current = setInterval(next, 8000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isPaused, next]);

    const step = steps[current];

    return (
        <section
            id="demo"
            className="bg-white py-24 dark:bg-[#0b1120]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto mb-10 max-w-3xl text-center">
                    <h2 className="text-4xl font-semibold text-slate-950 dark:text-slate-100">
                        Así funciona Agora
                    </h2>
                    <p className="mt-3 text-xl text-gray-400">
                        Recorré la plataforma paso a paso. Todo funciona de verdad.
                    </p>
                </div>

                <div className="mx-auto max-w-5xl">
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)] dark:border-slate-700 dark:bg-[#141f33] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                        {/* Browser chrome */}
                        <div className="flex items-center gap-2 border-b border-neutral-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-[#0b1120]">
                            <div className="flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-400" />
                                <div className="h-3 w-3 rounded-full bg-amber-400" />
                                <div className="h-3 w-3 rounded-full bg-emerald-400" />
                            </div>
                            <div className="mx-auto flex max-w-md flex-1 items-center justify-center rounded-lg bg-white px-3 py-1.5 text-xs text-slate-400 shadow-sm dark:bg-[#1a2740] dark:text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                app.agora.app/{step.id === "1" ? "dashboard" : `demo?step=${step.id}`}
                            </div>
                        </div>

                        {/* Iframe */}
                        <div className="relative" style={{ height: 460 }}>
                            {steps.map((s, i) => (
                                <div
                                    key={s.id}
                                    className={`transition-opacity duration-500 ${
                                        i === current ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                                    }`}
                                >
                                    <iframe
                                        src={`/demo?step=${s.id}`}
                                        className="w-full border-0"
                                        style={{ height: 460 }}
                                        title={`Paso: ${s.title}`}
                                        loading={i === 0 ? "eager" : "lazy"}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={prev}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-slate-500 transition-colors hover:border-[#275D79] hover:text-[#275D79] dark:border-slate-600 dark:text-slate-400 dark:hover:border-[#3a7fa0] dark:hover:text-[#3a7fa0]"
                            aria-label="Anterior"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>

                        <div className="flex items-center gap-2">
                            {steps.map((s, i) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setCurrent(i)}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        i === current ? "w-6 bg-[#275D79]" : "w-2 bg-slate-300 dark:bg-slate-600"
                                    }`}
                                    aria-label={`Ir a paso ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={next}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-slate-500 transition-colors hover:border-[#275D79] hover:text-[#275D79] dark:border-slate-600 dark:text-slate-400 dark:hover:border-[#3a7fa0] dark:hover:text-[#3a7fa0]"
                            aria-label="Siguiente"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm font-medium text-[#275D79]">Paso {step.id} de {steps.length}</p>
                        <p className="text-base font-semibold text-slate-950 dark:text-slate-100">{step.title}</p>
                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
