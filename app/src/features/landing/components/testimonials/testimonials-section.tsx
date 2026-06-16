"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MessageSquareQuote } from "lucide-react";

const testimonials = [
    {
        quote: "Agora me ahorra horas de corrección cada semana. La IA entiende el contexto de las respuestas y me da sugerencias muy precisas.",
        name: "María Fernández",
        role: "Profesora de Matemáticas, Colegio San Martín",
        avatar: "MF",
    },
    {
        quote: "Pasé de pasar listas en papel a tener todo digital. Mis estudiantes suben las tareas y yo las corrijo desde cualquier lado.",
        name: "Carlos Gómez",
        role: "Docente de Historia, Universidad Nacional",
        avatar: "CG",
    },
    {
        quote: "Lo que más me gusta es poder ver el progreso de cada estudiante en tiempo real. Las analíticas me ayudan a identificar quién necesita ayuda.",
        name: "Laura Martínez",
        role: "Directora Académica, Instituto Técnico",
        avatar: "LM",
    },
];

export default function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const goTo = useCallback((i: number) => {
        setActiveIndex((i + testimonials.length) % testimonials.length);
    }, []);

    const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

    useEffect(() => {
        if (isPaused) return;
        timerRef.current = setInterval(next, 5000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isPaused, next]);

    const t = testimonials[activeIndex];

    return (
        <section
            id="testimonios"
            className="bg-[#EBF3F6] py-24"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="mx-auto max-w-6xl px-6">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <h2 className="serif text-4xl tracking-tight text-slate-950">
                        Lo que dicen los educadores
                    </h2>
                    <p className="mt-3 text-xl text-gray-500">
                        Miles de profesores ya confían en Agora para gestionar sus clases.
                    </p>
                </div>

                <div className="mx-auto max-w-2xl">
                    <div className="relative min-h-[320px]">
                        {testimonials.map((testimonial, i) => (
                            <div
                                key={testimonial.name}
                                className={`absolute inset-0 flex flex-col rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-500 ease-in-out ${
                                    i === activeIndex
                                        ? "opacity-100 translate-x-0"
                                        : i < activeIndex
                                            ? "opacity-0 -translate-x-8"
                                            : "opacity-0 translate-x-8"
                                }`}
                                aria-hidden={i !== activeIndex}
                            >
                                <MessageSquareQuote size={32} className="mb-4 text-[#275D79] opacity-40" />

                                <blockquote className="flex-1 text-base leading-7 text-slate-600">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>

                                <div className="mt-6 flex items-center gap-3 border-t border-neutral-100 pt-6">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#275D79] text-sm font-semibold text-white">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-950">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-3">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => goTo(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    i === activeIndex
                                        ? "w-6 bg-[#275D79]"
                                        : "w-2 bg-slate-300 hover:bg-slate-400"
                                }`}
                                aria-label={`Ver testimonio ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
